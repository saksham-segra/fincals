// src/components/EPFCalculator.js
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
import './EPFCalculator.css';

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

const EPFCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentEPFBalance, setCurrentEPFBalance] = useState(200000);
  const [employeeContribution, setEmployeeContribution] = useState(12);
  const [employerContribution, setEmployerContribution] = useState(12);
  const [annualSalaryIncrement, setAnnualSalaryIncrement] = useState(5);
  const [interestRate, setInterestRate] = useState(8.15);
  const [totalContribution, setTotalContribution] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [yearlyData, setYearlyData] = useState({labels: [], balanceData: [], contributionData: [], interestData: []});
  
  // Initialize with default data to ensure chart renders
  useEffect(() => {
    // Set initial data if empty
    if (!yearlyData.labels || yearlyData.labels.length === 0) {
      setYearlyData({
        labels: ['Year 1', 'Year 2', 'Year 3'],
        balanceData: [300000, 400000, 500000],
        contributionData: [50000, 50000, 50000],
        interestData: [20000, 30000, 40000]
      });
    }
  }, []);

  useEffect(() => {
    calculateEPF();
  }, [basicSalary, currentAge, retirementAge, currentEPFBalance, employeeContribution, employerContribution, annualSalaryIncrement, interestRate]);
  
  const calculateEPF = () => {
    // Calculate years until retirement
    const yearsToRetirement = retirementAge - currentAge;
    
    if (yearsToRetirement <= 0) {
      return;
    }
    
    // Initialize variables
    let currentBalance = currentEPFBalance;
    let totalEmployeeContribution = 0;
    let totalEmployerContribution = 0;
    let totalInterestEarned = 0;
    let currentSalary = basicSalary;
    
    // Arrays to store yearly data for the chart
    const labels = [];
    const balanceData = [];
    const contributionData = [];
    const interestData = [];
    
    // Calculate EPF growth year by year
    for (let year = 1; year <= yearsToRetirement; year++) {
      labels.push(`Year ${year}`);
      
      // Calculate contributions for the year
      const yearlyEmployeeContribution = (currentSalary * employeeContribution / 100) * 12;
      const yearlyEmployerContribution = (currentSalary * employerContribution / 100) * 12;
      const yearlyTotalContribution = yearlyEmployeeContribution + yearlyEmployerContribution;
      
      // Calculate interest for the year
      // Interest is calculated on the previous balance plus half of the current year's contribution
      // This assumes contributions are made monthly throughout the year
      const yearlyInterest = (currentBalance + (yearlyTotalContribution / 2)) * (interestRate / 100);
      
      // Update running totals
      currentBalance += yearlyTotalContribution + yearlyInterest;
      totalEmployeeContribution += yearlyEmployeeContribution;
      totalEmployerContribution += yearlyEmployerContribution;
      totalInterestEarned += yearlyInterest;
      
      // Store data for charts
      balanceData.push(currentBalance);
      contributionData.push(yearlyTotalContribution);
      interestData.push(yearlyInterest);
      
      // Increase salary for next year
      currentSalary += currentSalary * (annualSalaryIncrement / 100);
    }
    
    // Update state with calculated values
    setTotalContribution(totalEmployeeContribution + totalEmployerContribution);
    setTotalInterest(totalInterestEarned);
    setMaturityAmount(currentBalance);
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
    <div className="epf-calculator">
      <h2>EPF Calculator</h2>
      
      <div className="main-layout">
        {/* Left Column - Input Section */}
        <div className="left-column">
          <div className="input-section">
            <div className="input-group">
              <div className="input-row">
                <label>Monthly Basic Salary (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    min="1000"
                    max="1000000"
                    step="1000"
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
                    max="57"
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
                    min={currentAge + 1}
                    max="70"
                    step="1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Current EPF Balance (₹)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={currentEPFBalance}
                    onChange={(e) => setCurrentEPFBalance(Number(e.target.value))}
                    min="0"
                    max="10000000"
                    step="10000"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Employee Contribution (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={employeeContribution}
                    onChange={(e) => setEmployeeContribution(Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Employer Contribution (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={employerContribution}
                    onChange={(e) => setEmployerContribution(Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Annual Salary Increment (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={annualSalaryIncrement}
                    onChange={(e) => setAnnualSalaryIncrement(Number(e.target.value))}
                    min="0"
                    max="30"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-row">
                <label>Interest Rate (%)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="0.01"
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
              <h3>Maturity Amount</h3>
              <p>{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts Section */}
        <div className="right-column">
          {/* Doughnut Chart */}
          <div className="chart-container pie-container">
            <h3>EPF Breakdown</h3>
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
            <h3>EPF Growth Over Time</h3>
            <div className="line-chart">
              {yearlyData && yearlyData.labels && yearlyData.labels.length > 0 && (
                <Line
                  data={{
                    labels: yearlyData.labels,
                    datasets: [
                      {
                        label: 'EPF Balance',
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
                          text: 'EPF Balance'
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
    </div>
  );
};

export default EPFCalculator;
