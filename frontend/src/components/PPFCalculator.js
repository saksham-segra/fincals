// src/components/PPFCalculator.js
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Line, Doughnut } from 'react-chartjs-2';
import './PPFCalculator.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PPFCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [existingBalance, setExistingBalance] = useState(0);
  const [interestRate, setInterestRate] = useState(7.1);
  const [investmentPeriod, setInvestmentPeriod] = useState(15);
  const [extendedPeriod, setExtendedPeriod] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [yearlyData, setYearlyData] = useState({labels: [], balanceData: [], investmentData: [], interestData: []});
  
  // Initialize with default data to ensure chart renders
  useEffect(() => {
    // Set initial data if empty
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        balanceData: [150000, 310650, 482806],
        investmentData: [150000, 150000, 150000],
        interestData: [10650, 22156, 34450]
      });
    }
  }, []);

  useEffect(() => {
    calculatePPF();
  }, [yearlyInvestment, existingBalance, interestRate, investmentPeriod, extendedPeriod]);
  
  const calculatePPF = () => {
    // Total period including extensions
    const totalPeriod = investmentPeriod + extendedPeriod;
    
    // Initialize variables
    let balance = existingBalance;
    let totalInvested = existingBalance;
    let totalInterestEarned = 0;
    
    // Arrays to store yearly data for the chart
    const labels = [];
    const balanceData = [];
    const investmentData = [];
    const interestData = [];
    
    // Calculate PPF growth year by year
    for (let year = 1; year <= totalPeriod; year++) {
      labels.push(`Year ${year}`);
      
      // Add yearly investment (only during the initial investment period)
      if (year <= investmentPeriod) {
        balance += yearlyInvestment;
        totalInvested += yearlyInvestment;
        investmentData.push(yearlyInvestment);
      } else {
        // During extension period, no new investments
        investmentData.push(0);
      }
      
      // Calculate interest for the year
      const yearlyInterest = balance * (interestRate / 100);
      balance += yearlyInterest;
      totalInterestEarned += yearlyInterest;
      
      // Store data for charts
      balanceData.push(balance);
      interestData.push(yearlyInterest);
    }
    
    // Update state with calculated values
    setTotalInvestment(totalInvested);
    setTotalInterest(totalInterestEarned);
    setMaturityAmount(balance);
    setYearlyData({
      labels,
      balanceData,
      investmentData,
      interestData
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="ppf-calculator">
      <h2>PPF Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Yearly Investment (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={yearlyInvestment}
                    onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                    min="500"
                    max="150000"
                    step="500"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Existing Balance (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={existingBalance}
                    onChange={(e) => setExistingBalance(Number(e.target.value))}
                    min="0"
                    max="10000000"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Interest Rate (% per annum)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min="1"
                    max="12"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Investment Period (years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                    min="15"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Extended Period (years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={extendedPeriod}
                    onChange={(e) => setExtendedPeriod(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="5"
                  />
                </div>
              </div>
              <small className="input-note">After the initial 15 years, PPF can be extended in blocks of 5 years</small>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-section">
              <div className="result-card">
                <h3>Total Investment</h3>
                <p>{formatCurrency(totalInvestment)}</p>
              </div>
              <div className="result-card">
                <h3>Total Interest</h3>
                <p>{formatCurrency(totalInterest)}</p>
              </div>
            </div>
            
            <div className="full-width-card">
              <h3>Maturity Amount</h3>
              <p>{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>PPF Breakdown</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Total Investment', 'Total Interest'],
                  datasets: [
                    {
                      data: [totalInvestment, totalInterest],
                      backgroundColor: ['#3182ce', '#48bb78'],
                      borderColor: ['#ffffff', '#ffffff'],
                      borderWidth: 1,
                      cutout: '70%',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 14
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const totalVal = totalInvestment + totalInterest;
                          const percentage = (value / totalVal * 100).toFixed(1);
                          return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Line Chart */}
          <div className="chart-container line-container">
            <h3>PPF Growth Over Time</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'PPF Balance',
                        data: yearlyData.balanceData,
                        borderColor: '#3182ce',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#3182ce',
                        yAxisID: 'y'
                      },
                      {
                        label: 'Yearly Investment',
                        data: yearlyData.investmentData,
                        borderColor: '#805ad5',
                        backgroundColor: 'rgba(128, 90, 213, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#805ad5',
                        yAxisID: 'y1'
                      },
                      {
                        label: 'Yearly Interest',
                        data: yearlyData.interestData,
                        borderColor: '#48bb78',
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#48bb78',
                        yAxisID: 'y1'
                      }
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'PPF Balance'
                        },
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value);
                          }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Yearly Amounts'
                        },
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value);
                          }
                        },
                        grid: {
                          drawOnChartArea: false,
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                          }
                        }
                      }
                    }
                  }}
                />
              )}
              {(!yearlyData || !yearlyData.labels || yearlyData.labels.length === 0) && (
                <div className="no-data-message">Loading chart data...</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* PPF Rules and Details Section */}
      <div className="ppf-rules-section">
        <h2>PPF Rules and Details</h2>
        
        <div className="rules-container">
          <div className="rule-card">
            <h3>What is PPF?</h3>
            <p>Public Provident Fund (PPF) is a long-term savings scheme introduced by the National Savings Institute of the Ministry of Finance, Government of India. It offers an investment avenue with attractive interest rates, tax benefits, and government backing.</p>
          </div>
          
          <div className="rule-card">
            <h3>Eligibility</h3>
            <ul>
              <li>Any Indian resident can open a PPF account</li>
              <li>Non-Resident Indians (NRIs) cannot open a new PPF account</li>
              <li>NRIs who opened accounts as residents can continue contributing until maturity</li>
              <li>Minors can have accounts operated by their guardians</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Contribution Limits</h3>
            <ul>
              <li>Minimum annual contribution: ₹500</li>
              <li>Maximum annual contribution: ₹1,50,000</li>
              <li>Contributions can be made in lump sum or in 12 installments</li>
              <li>Deposits can be made any time during the financial year</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Interest Rate</h3>
            <ul>
              <li>Interest rate is declared quarterly by the government</li>
              <li>Current rate: 7.1% per annum (compounded annually)</li>
              <li>Interest is calculated on the lowest balance between the 5th and the last day of each month</li>
              <li>Interest is credited at the end of each financial year (March 31st)</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Tax Benefits</h3>
            <ul>
              <li>Contributions qualify for tax deduction under Section 80C (up to ₹1.5 lakh)</li>
              <li>Interest earned is completely tax-free under Section 10(11)</li>
              <li>Maturity amount is completely tax-free</li>
              <li>One of the few EEE (Exempt-Exempt-Exempt) tax status instruments</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Tenure and Extension</h3>
            <ul>
              <li>Original tenure: 15 years</li>
              <li>Can be extended in blocks of 5 years indefinitely</li>
              <li>Extension can be with or without further contributions</li>
              <li>Extension must be applied for within 1 year of maturity</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Loan Facility</h3>
            <ul>
              <li>Loans available from 3rd to 6th financial year</li>
              <li>Loan amount: Up to 25% of the balance at the end of the 2nd preceding financial year</li>
              <li>Loan must be repaid within 36 months</li>
              <li>Second loan available only after full repayment of the first loan</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Withdrawal Rules</h3>
            <ul>
              <li>Partial withdrawals allowed from the 7th financial year</li>
              <li>Withdrawal amount: Up to 50% of the balance at the end of the 4th preceding financial year</li>
              <li>Only one withdrawal per financial year</li>
              <li>Premature closure allowed after 5 years for specific reasons (serious illness, higher education, etc.)</li>
            </ul>
          </div>
          
          <div className="rule-card">
            <h3>Nomination Facility</h3>
            <ul>
              <li>Nomination can be made at the time of opening the account</li>
              <li>Nomination can be changed during the tenure of the account</li>
              <li>Multiple nominees can be registered with specified shares</li>
              <li>In case of death, the nominee(s) can claim the balance</li>
            </ul>
          </div>
        </div>
        
        <div className="disclaimer">
          <p><strong>Disclaimer:</strong> The information provided is for educational purposes only. PPF rules and regulations are subject to change. Please refer to the official government notifications for the most up-to-date information.</p>
        </div>
      </div>
    </div>
  );
};

export default PPFCalculator;
