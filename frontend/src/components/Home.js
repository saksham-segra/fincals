// src/components/Home.js
import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faCoins, 
  faMoneyBillTransfer,
  faHandHoldingDollar,
  faCalculator,
  faBriefcase,
  faPiggyBank,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';

const Home = ({ setActiveTab }) => {
  const calculators = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate the future value of your Systematic Investment Plan with customizable parameters.',
      icon: <FontAwesomeIcon icon={faMoneyBillTransfer} />
    },
    {
      id: 'lumpsum',
      title: 'Lumpsum Calculator',
      description: 'Estimate the growth of your one-time investments over a specified time period.',
      icon: <FontAwesomeIcon icon={faCoins} />
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate your Equated Monthly Installment for loans and understand the payment breakdown.',
      icon: <FontAwesomeIcon icon={faCalculator} />
    },
    {
      id: 'swp',
      title: 'SWP Calculator',
      description: 'Plan your Systematic Withdrawal Plan and visualize how long your corpus will last.',
      icon: <FontAwesomeIcon icon={faHandHoldingDollar} />
    },
    {
      id: 'epf',
      title: 'EPF Calculator',
      description: 'Estimate your Employee Provident Fund growth and retirement corpus based on your salary.',
      icon: <FontAwesomeIcon icon={faBriefcase} />
    },
    {
      id: 'ppf',
      title: 'PPF Calculator',
      description: 'Calculate the maturity value of your Public Provident Fund investments over time.',
      icon: <FontAwesomeIcon icon={faPiggyBank} />
    },
    {
      id: 'nps',
      title: 'NPS Calculator',
      description: 'Plan your National Pension System investments and estimate your retirement benefits.',
      icon: <FontAwesomeIcon icon={faUserTie} />
    }
  ];

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Welcome to FinCals</h2>
        <p>Your one-stop solution for financial planning and investment calculations</p>
      </div>
      
      <div className="calculators-grid">
        {calculators.map(calculator => (
          <div 
            key={calculator.id}
            className="calculator-card"
            onClick={() => setActiveTab(calculator.id)}
          >
            <div className="calculator-icon">{calculator.icon}</div>
            <h3>{calculator.title}</h3>
            <p>{calculator.description}</p>
            <button className="use-calculator-btn">
              Use Calculator
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
