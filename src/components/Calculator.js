import React from 'react';
import { merge, Subject } from 'rxjs';
import { map, mapTo, scan, bufferCount, buffer, distinctUntilChanged, takeLast } from 'rxjs/operators';

import { calculate, addToFloat, isFloat, isNumber, isOperator } from './utils';

import './Calculator.css';

const numbers = ['=','.','0','1','2','3','4','5','6','7','8','9'].reverse();
const operators = ['AC', '÷', '×', '-', '+'];

const keySubject = new Subject();

const renderKey = cssClass => n => {
  return (
    <div
      key={n}
      className={cssClass}
      onClick={(e) => keySubject.next(e.target.textContent)}
    >
      {n}
    </div>
  );
};


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      output: ''
    }
  }

  setInput = (value) => {
    this.setState({
      input: value
    })
  }

  setOutput = (value) => {
    this.setState({
      output: value
    })
  };

  componentDidMount () {
    const key$ = keySubject.asObservable();

    merge(
      key$.pipe(map(value => value))
    ).pipe(
      scan((acc, cur) => {
        const lastIndex = acc.length - 1;
        const prevInput = acc[lastIndex];

        // restart if AC is clicked
        if (cur === 'AC') {
          this.setOutput([]);

          return [];
        }

        // prevent some chars from being input first
        if (!prevInput && (isOperator(cur) || cur === '.' || cur === '=')) {
          return acc;
        }

        if (prevInput) {
          // if "=" calculate and finish
          if (cur === '=') {
            this.setOutput(calculate(acc));

            return [];
          }

          // join consecutive number inputs into multi-digit numbers
          if (isNumber(prevInput) && isNumber(cur)) {
            let newVal;

            if (isFloat(prevInput)) {
              newVal = addToFloat(prevInput, cur);
            } else {
              newVal = parseInt(`${prevInput}${cur}`);
            }
            const newAcc = Object.assign([...acc], {[lastIndex]: newVal});
            this.setOutput(calculate(newAcc));

            return newAcc;
          }

          // if previous input is an operator, and we pressed an operator, replace the old one with new
          if (isOperator(prevInput) && isOperator(cur)) {
            const newAcc = Object.assign([...acc], {[lastIndex]: cur});
            this.setOutput(calculate(newAcc));

            return newAcc;
          }

          // we clicked .
          if (cur === '.') {
            const float = parseFloat(`${prevInput}${cur}`).toFixed(1);
            const newAcc = Object.assign([...acc], {[lastIndex]: float});
            this.setOutput(calculate(newAcc));

            return newAcc;
          }
        }

        if (isNumber(cur)) {
          const numValue = parseInt(cur);
          this.setOutput(calculate([...acc, numValue]));
          return [...acc, numValue];
        }

        return [...acc, cur];
      }, [])
    ).subscribe({
        next: v => {
          this.setInput(v)
        }
    });
  }

  render () {
    return (
      <div className="calculator">
        <div className="display">
          <div className="input">{this.state.input}</div>
          <div className="output">{this.state.output}</div>
        </div>
        <div className="keyboard">
          <div className="numbers">
            {numbers.map(renderKey('number'))}
          </div>
          <div className="operators">
            {operators.map(renderKey('operator'))}
          </div>
        </div>
      </div>
    )
  }
}

export default Calculator;
