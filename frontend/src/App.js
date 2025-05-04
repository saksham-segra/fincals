// src/App.js
import React, { useState } from 'react';
import './App.css';
import SIPCalculator from './components/SIPCalculator';
import SWPCalculator from './components/SWPCalculator';
import LumpsumCalculator from './components/LumpsumCalculator';
import EMICalculator from './components/EMICalculator';
import EPFCalculator from './components/EPFCalculator';
import PPFCalculator from './components/PPFCalculator';
import NPSCalculator from './components/NPSCalculator';
import Home from './components/Home';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        <h1>FinCals - Financial Calculators</h1>
      </header>
      
      <div className="calculator-tabs">
        <button 
          className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={`tab-button ${activeTab === 'sip' ? 'active' : ''}`}
          onClick={() => setActiveTab('sip')}
        >
          SIP Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'lumpsum' ? 'active' : ''}`}
          onClick={() => setActiveTab('lumpsum')}
        >
          Lumpsum Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'emi' ? 'active' : ''}`}
          onClick={() => setActiveTab('emi')}
        >
          EMI Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'swp' ? 'active' : ''}`}
          onClick={() => setActiveTab('swp')}
        >
          SWP Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'epf' ? 'active' : ''}`}
          onClick={() => setActiveTab('epf')}
        >
          EPF Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'ppf' ? 'active' : ''}`}
          onClick={() => setActiveTab('ppf')}
        >
          PPF Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'nps' ? 'active' : ''}`}
          onClick={() => setActiveTab('nps')}
        >
          NPS Calculator
        </button>
      </div>
      
      <main>
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'sip' && <SIPCalculator />}
        {activeTab === 'lumpsum' && <LumpsumCalculator />}
        {activeTab === 'emi' && <EMICalculator />}
        {activeTab === 'swp' && <SWPCalculator />}
        {activeTab === 'epf' && <EPFCalculator />}
        {activeTab === 'ppf' && <PPFCalculator />}
        {activeTab === 'nps' && <NPSCalculator />}
      </main>
      
      <footer>
        <p>© {new Date().getFullYear()} FinCals. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;