// src/App.js
import React, { useState } from 'react';
import './App.css';
import SIPCalculator from './components/SIPCalculator';
import SWPCalculator from './components/SWPCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('sip');

  return (
    <div className="App">
      <header className="App-header">
        <h1>FinCals - Financial Calculators</h1>
      </header>
      
      <div className="calculator-tabs">
        <button 
          className={`tab-button ${activeTab === 'sip' ? 'active' : ''}`}
          onClick={() => setActiveTab('sip')}
        >
          SIP Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'swp' ? 'active' : ''}`}
          onClick={() => setActiveTab('swp')}
        >
          SWP Calculator
        </button>
      </div>
      
      <main>
        {activeTab === 'sip' ? <SIPCalculator /> : <SWPCalculator />}
      </main>
      
      <footer>
        <p>© {new Date().getFullYear()} FinCals. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;