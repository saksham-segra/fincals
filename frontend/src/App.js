// src/App.js
import React from 'react';
import './App.css';
import SIPCalculator from './components/SIPCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FinCals - Financial Calculators</h1>
      </header>
      <main>
        <SIPCalculator />
      </main>
      <footer>
        <p>© {new Date().getFullYear()} FinCals. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;