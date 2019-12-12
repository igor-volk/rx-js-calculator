import { calculate, addToFloat, isFloat, isNumber, isOperator, isPrimary, isSecondary, operation } from './';

describe('Utils', () => {
  describe('isNumber()', () => {
    it('should return false if value is NOT a number', () => {
      const result = isNumber('aaa');
      expect(result).toEqual(false);
    });

    it('should return true if value is a number', () => {
      const result = isNumber(7);
      expect(result).toEqual(true);
    });
  });

  describe('isOperator()', () => {
    it('should return false if value is NOT an operator', () => {
      const result = isOperator('qqq');
      expect(result).toEqual(false);
    });

    it('should return true if value is an operator', () => {
      const operators = ['÷', '×', '-', '+'];
      for (const operator of operators) {
        const result = isOperator(operator);
        expect(result).toEqual(true);
      }
    });
  });

  describe('isPrimary()', () => {
    it('should return false if operator is NOT "×" or "÷"', () => {
      const result = isPrimary('qqq');
      expect(result).toEqual(false);
    });

    it('should return true if value is "×" or "÷"', () => {
      const operators = ['×', '÷'];
      for (const operator of operators) {
        const result = isPrimary(operator);
        expect(result).toEqual(true);
      }
    });
  });

  describe('isSecondary()', () => {
    it('should return false if operator is NOT "+" or "-"', () => {
      const result = isSecondary('qqq');
      expect(result).toEqual(false);
    });

    it('should return true if value is "+" or "-"', () => {
      const operators = ['+', '-'];
      for (const operator of operators) {
        const result = isSecondary(operator);
        expect(result).toEqual(true);
      }
    });
  });

  describe('operation()', () => {
    it('should add', () => {
      const result = operation(1, 2, '+');
      expect(result).toEqual(3);
    });

    it('should subtract', () => {
      const result = operation(3, 1, '-');
      expect(result).toEqual(2);
    });

    it('should devide', () => {
      const result = operation(6, 2, '÷');
      expect(result).toEqual(3);
    });

    it('should multiply', () => {
      const result = operation(4, 2, '×');
      expect(result).toEqual(8);
    });
  });

  describe('calculate()', () => {
    it('should calculate the result of an expression', () => {
      const tests = [
        {expression: [2, '+', 4, '-', 1], result: 5},
        {expression: [6, '×', 3, '÷', 2, '+', 1], result: 10},
        {expression: [7, '-', 3, '×', 2], result: 1},
        {expression: [9, '÷', 3, '+', 5, '×', 3], result: 18},
      ];

      for (const test of tests) {
        const result = calculate(test.expression);
        expect(result).toEqual(test.result);
      }
    });
  });
});
