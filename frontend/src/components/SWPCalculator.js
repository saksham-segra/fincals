// src/components/SWPCalculator.js
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
import './SWPCalculator.css';

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

const SWPCalculator = () => {
  // State variables for inputs
  const [initialCorpus, setInitialCorpus] = useState(10000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [withdrawalYears, setWithdrawalYears] = useState(20);
  const [withdrawalGrowthRate, setWithdrawalGrowthRate] = useState(6);
  const [isGrowthEnabled, setIsGrowthEnabled] = useState(false);
  
  // State variables for results
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [remainingCorpus, setRemainingCorpus] = useState(0);

  const [yearlyData, setYearlyData] = useState({
    labels: [], 
    withdrawalData: [], 
    corpusData: [], 

    yearlyWithdrawalAmounts: []
  });
  
  // Initialize with default data
  useEffect(() => {
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        withdrawalData: [monthlyWithdrawal * 12, monthlyWithdrawal * 12 * 2, monthlyWithdrawal * 12 * 3],
        corpusData: [initialCorpus * 0.9, initialCorpus * 0.8, initialCorpus * 0.7],
        inflationAdjustedCorpusData: [initialCorpus * 0.85, initialCorpus * 0.7, initialCorpus * 0.55],
        yearlyWithdrawalAmounts: [monthlyWithdrawal * 12, monthlyWithdrawal * 12, monthlyWithdrawal * 12]
      });
    }
  }, []);

  // Calculate SWP whenever inputs change
  useEffect(() => {
    calculateSWP();
  }, [initialCorpus, monthlyWithdrawal, annualReturn, withdrawalYears, withdrawalGrowthRate, isGrowthEnabled]);

  const calculateSWP = () => {
    // Convert annual return to monthly return
    const monthlyRate = annualReturn / 12 / 100;
    const totalMonths = withdrawalYears * 12;
    
    // Monthly growth rate
    const monthlyGrowthRate = withdrawalGrowthRate / 12 / 100;
    
    // Arrays to store yearly data for charts and table
    const yearLabels = [];
    const yearlyWithdrawalData = [];
    const yearlyCorpusData = [];
    const yearlyWithdrawalAmounts = [];
    
    // Initialize variables for calculation
    let runningCorpus = initialCorpus;
    let runningWithdrawal = 0;
    let currentMonthlyWithdrawal = monthlyWithdrawal;
    
    // Calculate year by year
    for (let year = 1; year <= withdrawalYears; year++) {
      yearLabels.push(`Year ${year}`);
      
      // Calculate withdrawal for this year
      let yearlyWithdrawal = 0;
      
      // Calculate month by month for this year
      for (let month = 1; month <= 12; month++) {
        // Apply growth to monthly withdrawal if enabled
        if (isGrowthEnabled && month === 1 && year > 1) {
          currentMonthlyWithdrawal *= (1 + withdrawalGrowthRate / 100);
        }
        
        // Add this month's withdrawal
        yearlyWithdrawal += currentMonthlyWithdrawal;
        
        // Update corpus: subtract withdrawal and add returns
        runningCorpus -= currentMonthlyWithdrawal;
        runningCorpus *= (1 + monthlyRate);
      }
      
      // Update running withdrawal total
      runningWithdrawal += yearlyWithdrawal;
      
      // Store data for this year
      yearlyWithdrawalAmounts.push(yearlyWithdrawal);
      yearlyWithdrawalData.push(runningWithdrawal);
      yearlyCorpusData.push(runningCorpus);
      
      // Check if corpus is depleted
      if (runningCorpus <= 0) {
        // Corpus depleted before withdrawal period ends
        for (let i = year + 1; i <= withdrawalYears; i++) {
          yearLabels.push(`Year ${i}`);
          yearlyWithdrawalAmounts.push(0);
          yearlyWithdrawalData.push(runningWithdrawal);
          yearlyCorpusData.push(0);
        }
        break;
      }
    }
    
    // Set state with calculation results
    setTotalWithdrawal(runningWithdrawal);
    setRemainingCorpus(runningCorpus);
    
    setYearlyData({
      labels: yearLabels,
      withdrawalData: yearlyWithdrawalData,
      corpusData: yearlyCorpusData,
      yearlyWithdrawalAmounts: yearlyWithdrawalAmounts
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
    <div className="swp-calculator">
      <h2>SWP Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Initial Corpus (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={initialCorpus}
                    onChange={(e) => setInitialCorpus(Number(e.target.value))}
                    min="100000"
                    max="1000000000"
                    step="100000"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Monthly Withdrawal (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={monthlyWithdrawal}
                    onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                    min="1000"
                    max="10000000"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Expected Annual Return (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    min="1"
                    max="30"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Withdrawal Period (Years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={withdrawalYears}
                    onChange={(e) => setWithdrawalYears(Number(e.target.value))}
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="input-group withdrawal-growth-group">
              <div className="growth-toggle">
                <label>Annual Withdrawal Growth</label>
                <div className="toggle-button-container">
                  <button 
                    className={`toggle-button ${isGrowthEnabled ? 'active' : ''}`}
                    onClick={() => setIsGrowthEnabled(!isGrowthEnabled)}
                  >
                    <span className="toggle-button-slider"></span>
                    <span className="toggle-button-text">{isGrowthEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
              
              {isGrowthEnabled && (
                <div className="growth-input">
                  <div className="input-row">
                    <label>Annual Growth Rate (%)</label>
                    <div className="input-field">
                      <input
                        type="number"
                        value={withdrawalGrowthRate}
                        onChange={(e) => setWithdrawalGrowthRate(Number(e.target.value))}
                        min="0"
                        max="25"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            

          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-section">
              <div className="result-card">
                <h3>Total Withdrawal</h3>
                <p>{formatCurrency(totalWithdrawal)}</p>
              </div>
              <div className="result-card total">
                <h3>Remaining Corpus</h3>
                <p>{formatCurrency(remainingCorpus)}</p>
              </div>
            </div>
            

          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>Withdrawal vs Remaining Corpus</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Total Withdrawal', 'Remaining Corpus'],
                  datasets: [
                    {
                      data: [totalWithdrawal, remainingCorpus],
                      backgroundColor: ['#3182ce', '#48bb78'],
                      borderColor: ['#ffffff', '#ffffff'],
                      borderWidth: 1,
                      cutout: '70%'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((context.raw / total) * 100);
                          return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true
                  }
                }}
              />
            </div>
          </div>
          
          {/* Line Chart */}
          <div className="chart-container line-container">
            <h3>Corpus & Withdrawal Over Time</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'Withdrawal Amount',
                        data: yearlyData.withdrawalData,
                        borderColor: '#3182ce',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#4299e1'
                      },
                      {
                        label: 'Corpus Value',
                        data: yearlyData.corpusData,
                        borderColor: '#48bb78',
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#48bb78'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
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
      
      {/* Investment Journey Table - Full Width at Bottom */}
      <div className="investment-journey-section">
        <h3>Year-by-Year Withdrawal Journey</h3>
        <div className="investment-table-wrapper">
          {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 ? (
            <table className="investment-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Withdrawal This Year</th>
                  <th>Total Withdrawn</th>
                  <th>Corpus at Year End</th>
                  <th>Returns</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.labels.map((year, index) => {
                  // Get the year number (1-based index)
                  const yearNum = index + 1;
                  
                  // Get data from the calculation results
                  const withdrawalThisYear = yearlyData.yearlyWithdrawalAmounts[index];
                  const totalWithdrawn = yearlyData.withdrawalData[index];
                  const corpusValue = yearlyData.corpusData[index];
                  
                  // Calculate returns (assuming returns = current corpus + total withdrawn - initial corpus)
                  const returns = corpusValue + totalWithdrawn - initialCorpus;
                  
                  // Get inflation-adjusted corpus value

                  return (
                    <tr key={year} className={yearNum === withdrawalYears ? 'highlight-row' : ''}>
                      <td>{year}</td>
                      <td>{formatCurrency(withdrawalThisYear)}</td>
                      <td>{formatCurrency(totalWithdrawn)}</td>
                      <td>{formatCurrency(corpusValue)}</td>
                      <td>{formatCurrency(returns)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">Loading table data...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
