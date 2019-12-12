import React from 'react';
import Calculator from './components/Calculator';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        RxJs Calculator
      </header>
      <div className="App-container">
        <Calculator />
      </div>
    </div>
  );
}

export default App;
