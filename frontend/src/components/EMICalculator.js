// src/components/EMICalculator.js
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
import './EMICalculator.css';

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

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState('years'); // 'years' or 'months'
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [yearlyData, setYearlyData] = useState({labels: [], principalData: [], interestData: []});
  
  // Initialize with default data to ensure chart renders
  useEffect(() => {
    // Set initial data if empty
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        principalData: [loanAmount/3, loanAmount/3, loanAmount/3],
        interestData: [loanAmount*0.085, loanAmount*0.085*0.8, loanAmount*0.085*0.6]
      });
    }
  }, []);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure, tenureType]);
  
  const calculateEMI = () => {
    // Convert tenure to months if in years
    const tenureInMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;
    
    // Convert annual interest rate to monthly and decimal form
    const monthlyInterestRate = interestRate / (12 * 100);
    
    // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const emiValue = loanAmount * monthlyInterestRate * 
                    Math.pow(1 + monthlyInterestRate, tenureInMonths) / 
                    (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    
    // Calculate total payment and interest
    const totalPaymentValue = emiValue * tenureInMonths;
    const totalInterestValue = totalPaymentValue - loanAmount;
    
    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalPayment(totalPaymentValue);
    
    // Generate amortization schedule
    generateAmortizationSchedule(emiValue, monthlyInterestRate, tenureInMonths);
  };
  
  const generateAmortizationSchedule = (emiValue, monthlyInterestRate, tenureInMonths) => {
    let schedule = [];
    let balance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    
    for (let month = 1; month <= tenureInMonths; month++) {
      const interestForMonth = balance * monthlyInterestRate;
      const principalForMonth = emiValue - interestForMonth;
      
      balance -= principalForMonth;
      totalPrincipalPaid += principalForMonth;
      totalInterestPaid += interestForMonth;
      
      schedule.push({
        month,
        emi: emiValue,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: balance > 0 ? balance : 0,
        totalPrincipalPaid,
        totalInterestPaid
      });
    }
    
    setAmortizationSchedule(schedule);
    
    // Prepare yearly data for charts
    prepareYearlyData(schedule, tenureInMonths);
  };
  
  const prepareYearlyData = (schedule, tenureInMonths) => {
    const years = Math.ceil(tenureInMonths / 12);
    const labels = [];
    const principalData = [];
    const interestData = [];
    
    for (let year = 1; year <= years; year++) {
      labels.push(`Year ${year}`);
      
      // Calculate principal and interest for this year
      const yearStart = (year - 1) * 12;
      const yearEnd = Math.min(year * 12, tenureInMonths);
      
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = yearStart; month < yearEnd; month++) {
        if (schedule[month]) {
          yearlyPrincipal += schedule[month].principal;
          yearlyInterest += schedule[month].interest;
        }
      }
      
      principalData.push(yearlyPrincipal);
      interestData.push(yearlyInterest);
    }
    
    setYearlyData({
      labels,
      principalData,
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
    <div className="emi-calculator">
      <h2>EMI Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Loan Amount (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min="10000"
                    max="100000000"
                    step="10000"
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
                    max="30"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Loan Tenure</label>
                <div className="input-field tenure-field">
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    min="1"
                    max={tenureType === 'years' ? 30 : 360}
                    step="1"
                  />
                  <div className="tenure-toggle">
                    <button 
                      className={`toggle-btn ${tenureType === 'years' ? 'active' : ''}`}
                      onClick={() => setTenureType('years')}
                    >
                      Years
                    </button>
                    <button 
                      className={`toggle-btn ${tenureType === 'months' ? 'active' : ''}`}
                      onClick={() => setTenureType('months')}
                    >
                      Months
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-section">
              <div className="result-card">
                <h3>Loan EMI</h3>
                <p>{formatCurrency(emi)}</p>
                <small>per month</small>
              </div>
              <div className="result-card">
                <h3>Total Interest</h3>
                <p>{formatCurrency(totalInterest)}</p>
              </div>
            </div>
            
            <div className="full-width-card">
              <h3>Total Payment</h3>
              <p>{formatCurrency(totalPayment)}</p>
              <small>(Principal + Interest)</small>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>Payment Breakdown</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Principal Amount', 'Interest Amount'],
                  datasets: [
                    {
                      data: [loanAmount, totalInterest],
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
                          const totalVal = loanAmount + totalInterest;
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
          
          {/* Stacked Bar Chart */}
          <div className="chart-container line-container">
            <h3>Yearly Payment Breakdown</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'Principal',
                        data: yearlyData.principalData,
                        backgroundColor: 'rgba(49, 130, 206, 0.7)',
                        borderColor: '#3182ce',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#3182ce'
                      },
                      {
                        label: 'Interest',
                        data: yearlyData.interestData,
                        backgroundColor: 'rgba(72, 187, 120, 0.7)',
                        borderColor: '#48bb78',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#48bb78'
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
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value);
                          }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
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
    </div>
  );
};

export default EMICalculator;
