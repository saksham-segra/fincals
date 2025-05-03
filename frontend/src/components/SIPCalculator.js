// src/components/SIPCalculator.js
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
import './SIPCalculator.css';

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

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [lumpsumAmount, setLumpsumAmount] = useState(0);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [totalYears, setTotalYears] = useState(20);
  const [stepUpPercentage, setStepUpPercentage] = useState(0);
  const [isStepUpEnabled, setIsStepUpEnabled] = useState(false);
  const [stepUpYears, setStepUpYears] = useState(10);
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
        investmentData: [monthlyInvestment * 12, monthlyInvestment * 24, monthlyInvestment * 36],
        totalValueData: [monthlyInvestment * 12 * 1.1, monthlyInvestment * 24 * 1.2, monthlyInvestment * 36 * 1.3]
      });
    }
  }, []);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, lumpsumAmount, annualReturn, sipYears, totalYears, stepUpPercentage, isStepUpEnabled, stepUpYears, inflationRate, adjustForInflation]);
  
  // Ensure stepUpYears doesn't exceed sipYears
  useEffect(() => {
    if (stepUpYears > sipYears) {
      setStepUpYears(sipYears);
    }
  }, [sipYears, stepUpYears]);
  
  // Ensure totalYears is not less than sipYears
  useEffect(() => {
    if (totalYears < sipYears) {
      setTotalYears(sipYears);
    }
  }, [sipYears, totalYears]);

  const calculateSIP = () => {
    // Convert annual return to monthly return
    const monthlyRate = annualReturn / 12 / 100;
    const sipMonths = sipYears * 12;
    const totalMonths = totalYears * 12;
    
    // Arrays to store yearly data for the chart
    const yearLabels = [];
    const yearlyInvestmentData = [];
    const yearlyTotalValueData = [];
    const yearlyInflationAdjustedValueData = [];
    
    // Calculate the future value of the lumpsum amount
    const lumpsumFutureValue = lumpsumAmount * Math.pow(1 + monthlyRate, totalMonths);
    
    // Monthly inflation rate
    const monthlyInflationRate = inflationRate / 12 / 100;
    
    if (!isStepUpEnabled || stepUpPercentage === 0) {
      // Standard SIP calculation without step-up
      let runningInvestment = lumpsumAmount;
      let runningValue = lumpsumAmount;
      
      // Calculate year by year for the chart data
      for (let year = 1; year <= totalYears; year++) {
        yearLabels.push(`Year ${year}`);
        
        if (year <= sipYears) {
          // During SIP period
          runningInvestment += monthlyInvestment * 12;
          
          // Calculate value at the end of this year
          // Value of SIP at the end of this year
          const sipValue = monthlyInvestment * 
            ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * 
            (1 + monthlyRate);
          
          // Value of initial lumpsum at the end of this year
          const lumpsumValue = lumpsumAmount * Math.pow(1 + monthlyRate, year * 12);
          
          runningValue = sipValue + lumpsumValue;
        } else {
          // After SIP period, only compounding
          runningValue = runningValue * Math.pow(1 + monthlyRate, 12);
        }
        
        // Calculate inflation-adjusted value if needed
        let inflationAdjustedValue = runningValue;
        if (adjustForInflation) {
          // Adjust for inflation over the years
          inflationAdjustedValue = runningValue / Math.pow(1 + monthlyInflationRate, year * 12);
        }
        
        yearlyInvestmentData.push(runningInvestment);
        yearlyTotalValueData.push(runningValue);
        yearlyInflationAdjustedValueData.push(inflationAdjustedValue);
      }
      
      const invested = monthlyInvestment * sipMonths + lumpsumAmount;
      const finalValue = runningValue;
      
      // Calculate inflation-adjusted final value
      let adjustedFinalValue = finalValue;
      if (adjustForInflation) {
        adjustedFinalValue = finalValue / Math.pow(1 + monthlyInflationRate, totalMonths);
      }
      
      setTotalInvestment(invested);
      setEstimatedReturns(finalValue - invested);
      setTotalValue(finalValue);
      setInflationAdjustedValue(adjustedFinalValue);
      setYearlyData({
        labels: yearLabels,
        investmentData: yearlyInvestmentData,
        totalValueData: adjustForInflation ? yearlyInflationAdjustedValueData : yearlyTotalValueData
      });
    } else {
      // Step-up SIP calculation
      let runningInvestment = lumpsumAmount;
      let runningValue = lumpsumAmount;
      let currentMonthlyInvestment = monthlyInvestment;
      let totalInvested = lumpsumAmount;
      
      // Calculate year by year for the chart data
      for (let year = 1; year <= totalYears; year++) {
        yearLabels.push(`Year ${year}`);
        
        if (year <= sipYears) {
          // During SIP period
          // Add this year's investment to running total
          runningInvestment += currentMonthlyInvestment * 12;
          
          // For the running value, we need to calculate more precisely
          // We'll recalculate the entire value up to this point
          let sipValue = 0;
          let tempMonthlyInvestment = monthlyInvestment;
          
          for (let y = 0; y < year; y++) {
            for (let m = 0; m < 12; m++) {
              const monthsRemaining = (year * 12) - (y * 12 + m) - 1;
              sipValue += tempMonthlyInvestment * Math.pow(1 + monthlyRate, monthsRemaining + 1);
            }
            
            if (y < stepUpYears - 1 && y < year - 1) {
              tempMonthlyInvestment += tempMonthlyInvestment * (stepUpPercentage / 100);
            }
          }
          
          // Value of initial lumpsum at the end of this year
          const lumpsumValue = lumpsumAmount * Math.pow(1 + monthlyRate, year * 12);
          
          runningValue = sipValue + lumpsumValue;
          
          // Increase investment for next year based on step-up percentage
          if (year < stepUpYears) {
            currentMonthlyInvestment += currentMonthlyInvestment * (stepUpPercentage / 100);
          }
        } else {
          // After SIP period, only compounding
          runningValue = runningValue * Math.pow(1 + monthlyRate, 12);
        }
        
        // Calculate inflation-adjusted value if needed
        let inflationAdjustedValue = runningValue;
        if (adjustForInflation) {
          // Adjust for inflation over the years
          inflationAdjustedValue = runningValue / Math.pow(1 + monthlyInflationRate, year * 12);
        }
        
        yearlyInvestmentData.push(runningInvestment);
        yearlyTotalValueData.push(runningValue);
        yearlyInflationAdjustedValueData.push(inflationAdjustedValue);
      }
      
      // Calculate total invested amount
      for (let year = 0; year < sipYears; year++) {
        for (let month = 0; month < 12; month++) {
          if (year * 12 + month >= sipMonths) break;
          
          if (year > 0 && year < stepUpYears) {
            const stepUpFactor = Math.pow(1 + stepUpPercentage / 100, year);
            totalInvested += monthlyInvestment * stepUpFactor;
          } else {
            totalInvested += monthlyInvestment;
          }
        }
      }
      
      const finalValue = runningValue;
      
      // Calculate inflation-adjusted final value
      let adjustedFinalValue = finalValue;
      if (adjustForInflation) {
        adjustedFinalValue = finalValue / Math.pow(1 + monthlyInflationRate, totalMonths);
      }
      
      setTotalInvestment(totalInvested);
      setEstimatedReturns(finalValue - totalInvested);
      setTotalValue(finalValue);
      setInflationAdjustedValue(adjustedFinalValue);
      setYearlyData({
        labels: yearLabels,
        investmentData: yearlyInvestmentData,
        totalValueData: adjustForInflation ? yearlyInflationAdjustedValueData : yearlyTotalValueData
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="sip-calculator">
      <h2>SIP Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Monthly Investment (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    min="500"
                    max="100000"
                    step="500"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Initial Lumpsum Amount (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    min="0"
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
                <label>SIP Duration (Years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={sipYears}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSipYears(value);
                      if (value > totalYears) {
                        setTotalYears(value);
                      }
                    }}
                    min="1"
                    max="30"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <div className="input-row">
                <label>Total Investment Period (Years)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={totalYears}
                    onChange={(e) => setTotalYears(Math.max(Number(e.target.value), sipYears))}
                    min={sipYears}
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="input-group step-up-group">
              <div className="step-up-toggle">
                <label>Annual Step-Up</label>
                <div className="toggle-button-container">
                  <button 
                    className={`toggle-button ${isStepUpEnabled ? 'active' : ''}`}
                    onClick={() => setIsStepUpEnabled(!isStepUpEnabled)}
                  >
                    <span className="toggle-button-slider"></span>
                    <span className="toggle-button-text">{isStepUpEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
              
              {isStepUpEnabled && (
                <div className="step-up-input">
                  <div className="input-row">
                    <label>Annual Step-Up Percentage (%)</label>
                    <div className="input-field">
                      <input
                        type="number"
                        value={stepUpPercentage}
                        onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                        min="0"
                        max="25"
                        step="0.5"
                        disabled={!isStepUpEnabled}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <label>Step-Up Duration (Years)</label>
                    <div className="input-field">
                      <input
                        type="number"
                        value={stepUpYears}
                        onChange={(e) => setStepUpYears(Math.min(Number(e.target.value), sipYears))}
                        min="1"
                        max={sipYears}
                        step="1"
                        disabled={!isStepUpEnabled}
                      />
                    </div>
                  </div>
                </div>
              )}
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
              <div className="result-card total">
                <h3>Total Value</h3>
                <p>{formatCurrency(totalValue)}</p>
              </div>
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
                      backgroundColor: ['#4299e1', '#48bb78'],
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
                        borderColor: '#4299e1',
                        backgroundColor: 'rgba(66, 153, 225, 0.1)',
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

export default SIPCalculator;