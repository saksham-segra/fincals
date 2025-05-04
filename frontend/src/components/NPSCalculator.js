// src/components/NPSCalculator.js
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
import './NPSCalculator.css';

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

const NPSCalculator = () => {
  // State variables for inputs
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [equityAllocation, setEquityAllocation] = useState(75);
  const [annuityPercentage, setAnnuityPercentage] = useState(40);
  const [annuityReturn, setAnnuityReturn] = useState(6);
  
  // State variables for results
  const [totalContribution, setTotalContribution] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [corpusAtRetirement, setCorpusAtRetirement] = useState(0);
  const [lumpSumAmount, setLumpSumAmount] = useState(0);
  const [annuityCorpus, setAnnuityCorpus] = useState(0);
  const [monthlyPension, setMonthlyPension] = useState(0);
  const [yearlyData, setYearlyData] = useState({
    labels: [], 
    balanceData: [], 
    contributionData: [], 
    interestData: []
  });
  
  // Initialize with default data to ensure chart renders
  useEffect(() => {
    // Set initial data if empty
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        balanceData: [60000, 126600, 200226],
        contributionData: [60000, 60000, 60000],
        interestData: [6600, 13626, 21600]
      });
    }
  }, []);

  // Calculate NPS returns whenever inputs change
  useEffect(() => {
    calculateNPS();
  }, [
    monthlyContribution, 
    currentAge, 
    retirementAge, 
    currentBalance, 
    expectedReturn, 
    equityAllocation,
    annuityPercentage,
    annuityReturn
  ]);
  
  const calculateNPS = () => {
    // Validate inputs
    if (currentAge >= retirementAge) {
      return;
    }
    
    // Calculate investment period in years
    const investmentPeriod = retirementAge - currentAge;
    
    // Initialize variables
    let balance = currentBalance;
    let totalContributed = currentBalance;
    let totalInterestEarned = 0;
    
    // Arrays to store yearly data for charts
    const labels = [];
    const balanceData = [];
    const contributionData = [];
    const interestData = [];
    
    // Calculate year by year growth
    for (let year = 1; year <= investmentPeriod; year++) {
      labels.push(`Year ${year}`);
      
      // Yearly contribution
      const yearlyContribution = monthlyContribution * 12;
      balance += yearlyContribution;
      totalContributed += yearlyContribution;
      contributionData.push(yearlyContribution);
      
      // Calculate interest based on asset allocation
      const equityPortion = balance * (equityAllocation / 100);
      const debtPortion = balance - equityPortion;
      
      // Assuming equity returns are higher than debt returns (simplified model)
      const equityReturn = equityPortion * (expectedReturn / 100);
      const debtReturn = debtPortion * ((expectedReturn - 2) / 100); // Debt typically returns less than equity
      
      const yearlyInterest = equityReturn + debtReturn;
      balance += yearlyInterest;
      totalInterestEarned += yearlyInterest;
      
      // Store data for charts
      balanceData.push(balance);
      interestData.push(yearlyInterest);
    }
    
    // Calculate annuity and lump sum
    const annuityAmount = balance * (annuityPercentage / 100);
    const lumpSumAmount = balance - annuityAmount;
    
    // Calculate monthly pension (simplified calculation)
    // Assuming annuity return and life expectancy of 85 years
    const pensionYears = 85 - retirementAge;
    const monthlyPension = (annuityAmount * (annuityReturn / 100)) / 12;
    
    // Update state with calculated values
    setTotalContribution(totalContributed);
    setTotalInterest(totalInterestEarned);
    setCorpusAtRetirement(balance);
    setLumpSumAmount(lumpSumAmount);
    setAnnuityCorpus(annuityAmount);
    setMonthlyPension(monthlyPension);
    setYearlyData({
      labels,
      balanceData,
      contributionData,
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
    <div className="nps-calculator">
      <h2>NPS Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Monthly Contribution (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    min="500"
                    max="100000"
                    step="500"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Current Age (years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    min="18"
                    max="59"
                    step="1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Retirement Age (years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    min="60"
                    max="70"
                    step="1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Current NPS Balance (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Expected Return (% p.a.)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min="5"
                    max="15"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Equity Allocation (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={equityAllocation}
                    onChange={(e) => setEquityAllocation(Number(e.target.value))}
                    min="0"
                    max="75"
                    step="5"
                  />
                </div>
              </div>
              <small className="input-note">Maximum equity allocation allowed is 75%</small>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Annuity Percentage (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={annuityPercentage}
                    onChange={(e) => setAnnuityPercentage(Number(e.target.value))}
                    min="40"
                    max="100"
                    step="5"
                  />
                </div>
              </div>
              <small className="input-note">Minimum 40% of corpus must be used for annuity</small>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Annuity Return (% p.a.)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={annuityReturn}
                    onChange={(e) => setAnnuityReturn(Number(e.target.value))}
                    min="3"
                    max="10"
                    step="0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-section">
              <div className="result-card">
                <h3>Total Contribution</h3>
                <p>{formatCurrency(totalContribution)}</p>
              </div>
              <div className="result-card">
                <h3>Total Interest</h3>
                <p>{formatCurrency(totalInterest)}</p>
              </div>
            </div>
            
            <div className="full-width-card">
              <h3>Corpus at Retirement</h3>
              <p>{formatCurrency(corpusAtRetirement)}</p>
            </div>
            
            <div className="results-section">
              <div className="result-card">
                <h3>Lump Sum Amount</h3>
                <p>{formatCurrency(lumpSumAmount)}</p>
              </div>
              <div className="result-card">
                <h3>Annuity Corpus</h3>
                <p>{formatCurrency(annuityCorpus)}</p>
              </div>
            </div>
            
            <div className="pension-card">
              <h3>Monthly Pension</h3>
              <p>{formatCurrency(monthlyPension)}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>NPS Breakdown</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Total Contribution', 'Total Interest'],
                  datasets: [
                    {
                      data: [totalContribution, totalInterest],
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
                          const totalVal = totalContribution + totalInterest;
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
            <h3>NPS Growth Over Time</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'NPS Balance',
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
                        label: 'Yearly Contribution',
                        data: yearlyData.contributionData,
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
                          text: 'NPS Balance'
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
          
          {/* Additional Chart for Retirement Breakdown */}
          <div className="chart-container pie-container">
            <h3>Retirement Corpus Breakdown</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Lump Sum Amount', 'Annuity Corpus'],
                  datasets: [
                    {
                      data: [lumpSumAmount, annuityCorpus],
                      backgroundColor: ['#805ad5', '#ed8936'],
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
                          const totalVal = lumpSumAmount + annuityCorpus;
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
        </div>
      </div>
    </div>
  );
};

export default NPSCalculator;
