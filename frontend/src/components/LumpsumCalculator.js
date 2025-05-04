// src/components/LumpsumCalculator.js
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
import './LumpsumCalculator.css';

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

const LumpsumCalculator = () => {
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentYears, setInvestmentYears] = useState(10);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [yearlyData, setYearlyData] = useState({labels: [], investmentData: [], totalValueData: []});
  const [inflationRate, setInflationRate] = useState(6);
  const [adjustForInflation, setAdjustForInflation] = useState(false);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState(0);
  
  // Initialize with default data to ensure chart renders
  useEffect(() => {
    // Set initial data if empty
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        investmentData: [lumpsumAmount, lumpsumAmount, lumpsumAmount],
        totalValueData: [lumpsumAmount * 1.12, lumpsumAmount * 1.12 * 1.12, lumpsumAmount * 1.12 * 1.12 * 1.12]
      });
    }
  }, []);

  useEffect(() => {
    calculateLumpsum();
  }, [lumpsumAmount, annualReturn, investmentYears, inflationRate, adjustForInflation]);
  
  const calculateLumpsum = () => {
    // Convert annual return to annual rate
    const annualRate = annualReturn / 100;
    const totalMonths = investmentYears * 12;
    
    // Arrays to store yearly data for the chart
    const yearLabels = [];
    const yearlyInvestmentData = [];
    const yearlyTotalValueData = [];
    const yearlyInflationAdjustedValueData = [];
    
    // Monthly inflation rate
    const monthlyInflationRate = inflationRate / 12 / 100;
    
    // Calculate year by year for the chart data
    let runningValue = lumpsumAmount;
    
    for (let year = 1; year <= investmentYears; year++) {
      yearLabels.push(`Year ${year}`);
      
      // Calculate value at the end of this year
      runningValue = lumpsumAmount * Math.pow(1 + annualRate, year);
      
      // Calculate inflation-adjusted value if needed
      let inflationAdjustedValue = runningValue;
      if (adjustForInflation) {
        // Adjust for inflation over the years
        inflationAdjustedValue = runningValue / Math.pow(1 + monthlyInflationRate, year * 12);
      }
      
      yearlyInvestmentData.push(lumpsumAmount);
      yearlyTotalValueData.push(runningValue);
      yearlyInflationAdjustedValueData.push(inflationAdjustedValue);
    }
    
    const finalValue = runningValue;
    
    // Calculate inflation-adjusted final value
    let adjustedFinalValue = finalValue;
    if (adjustForInflation) {
      adjustedFinalValue = finalValue / Math.pow(1 + monthlyInflationRate, totalMonths);
    }
    
    setTotalInvestment(lumpsumAmount);
    setEstimatedReturns(finalValue - lumpsumAmount);
    setTotalValue(finalValue);
    setInflationAdjustedValue(adjustedFinalValue);
    setYearlyData({
      labels: yearLabels,
      investmentData: yearlyInvestmentData,
      totalValueData: adjustForInflation ? yearlyInflationAdjustedValueData : yearlyTotalValueData
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
    <div className="lumpsum-calculator">
      <h2>Lumpsum Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Lumpsum Investment Amount (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
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
                <label>Investment Duration (Years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(Number(e.target.value))}
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="input-group inflation-group">
              <div className="step-up-toggle">
                <label>Adjust for Inflation</label>
                <div className="toggle-button-container">
                  <button 
                    className={`toggle-button ${adjustForInflation ? 'active' : ''}`}
                    onClick={() => setAdjustForInflation(!adjustForInflation)}
                  >
                    <span className="toggle-button-slider"></span>
                    <span className="toggle-button-text">{adjustForInflation ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
              
              {adjustForInflation && (
                <div className="step-up-input">
                  <div className="input-row">
                    <label>Expected Inflation Rate (%)</label>
                    <div className="input-field">
                      <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(Number(e.target.value))}
                        min="0"
                        max="15"
                        step="0.5"
                        disabled={!adjustForInflation}
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
                <h3>Invested Amount</h3>
                <p>{formatCurrency(totalInvestment)}</p>
              </div>
              <div className="result-card">
                <h3>Estimated Returns</h3>
                <p>{formatCurrency(estimatedReturns)}</p>
              </div>
            </div>
            
            <div className="full-width-card">
              <h3>Total Value</h3>
              <p>{formatCurrency(totalValue)}</p>
            </div>
            
            {adjustForInflation && (
              <div className="inflation-adjusted-value">
                <h3>Inflation-Adjusted Value</h3>
                <p>{formatCurrency(inflationAdjustedValue)}</p>
                <small>Present value of your corpus adjusted for inflation</small>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>Investment Breakdown</h3>
            <div className="pie-chart">
              <Doughnut 
                data={{
                  labels: ['Invested Amount', 'Estimated Returns'],
                  datasets: [
                    {
                      data: adjustForInflation ? 
                        [totalInvestment, inflationAdjustedValue - totalInvestment] : 
                        [totalInvestment, estimatedReturns],
                      backgroundColor: ['#3182ce', '#48bb78'],
                      borderColor: ['#ffffff', '#ffffff'],
                      borderWidth: 1,
                      cutout: '70%', // Makes the doughnut thinner
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
                          const totalVal = adjustForInflation ? inflationAdjustedValue : totalValue;
                          const percentage = (value / totalVal * 100).toFixed(1);
                          return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        },
                        title: function(context) {
                          return adjustForInflation ? 
                            `${context[0].label} (Inflation Adjusted)` : 
                            context[0].label;
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
            <h3>Growth Over Time</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'Total Value',
                        data: yearlyData.totalValueData,
                        borderColor: '#48bb78',
                        backgroundColor: 'rgba(72, 187, 120, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#48bb78'
                      },
                      {
                        label: 'Invested Amount',
                        data: yearlyData.investmentData,
                        borderColor: '#3182ce',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#90cdf4'
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

export default LumpsumCalculator;
