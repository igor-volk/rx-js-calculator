export const isNumber = value => {
  const num = parseFloat(value);
  return !isNaN(num);
};

export const isFloat = value => {
  if (typeof value === 'string') {
    return value.indexOf('.') !== -1;
  }

  return !Number.isInteger(value);
};

export const addToFloat = (float, value) => {
  let floatStr;
  if (typeof float === 'number') {
    floatStr = float.toString();
  } else {
    floatStr = float;
  }
  const arr = floatStr.split('.');
  const left = arr[0];
  const right = (arr[1] === '0') ? value : `${arr[1]}${value}`;
  const result = `${left}.${right}`;

  return parseFloat(result)
};

export const isOperator = value => {
  return (value === '÷' || value === '×' || value === '-' || value === '+');
};

export const isPrimary = value => {
  return (value === '÷' || value === '×');
};

export const isSecondary = value => {
  return (value === '-' || value === '+');
};

export const operation = (a, b, o) => {
  switch(o) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return a / b;
  }
};

export const calculate = (inputs) => {
  const calculation = inputs.reduce((acc, cur, ind, arr) => {
    if (isOperator(cur)) {
      return acc;
    }

    // this is a bit of a hacky way to handle float input
    // I did try to find a way to do it with RxJs buffer, but haven't found a 100% working solution.
    if (typeof cur === 'string') {
      cur = parseFloat(cur);
    }

    const prevOperator = arr[ind - 1] ? arr[ind - 1] : undefined;
    const nextOperator = arr[ind + 1] ? arr[ind + 1] : undefined;

    // 1
    if (!prevOperator && !nextOperator) {
      return { ...acc, result: cur };
    }

    // 1 + (2)
    if (isSecondary(prevOperator) && !nextOperator) {
      return { ...acc, result: operation(acc.result, cur, prevOperator) };
    }

    // 5 + 2 * (2)
    if (isPrimary(prevOperator) && !nextOperator) {
      const totalBuffer = operation(acc.buffer, cur, prevOperator);
      return { ...acc, result: operation(acc.result, totalBuffer, acc.operator), buffer: 0, operator: null };
    }

    // (1) + 2
    if (!prevOperator && isSecondary(nextOperator)) {
      return { ...acc, result: cur };
    }

    // (1) * 2
    if (!prevOperator && isPrimary(nextOperator)) {
      return { ...acc, buffer: cur, operator: '+' };
    }

    // 1 + (2) * 3
    if (isSecondary(prevOperator) && isPrimary(nextOperator)) {
      return { ...acc, buffer: cur, operator: prevOperator };
    }

    // 1 * (2) + 3
    if (isPrimary(prevOperator) && isSecondary(nextOperator)) {
      const totalBuffer = operation(acc.buffer, cur, prevOperator);
      return { result: operation(acc.result, totalBuffer, acc.operator), buffer: 0, operator: null };
    }

    // 1 * (2) * 3
    if (isPrimary(prevOperator) && isPrimary(nextOperator)) {
      return { result: acc.result, buffer: operation(acc.buffer, cur, prevOperator), operator: acc.operator };
    }

    // 1 + (2) + 3
    if (isSecondary(prevOperator) && isSecondary(nextOperator)) {
      return { ...acc, result: operation(acc.result, cur, prevOperator)};
    }

    return acc;
  }, { result: 0, buffer: 0, operator: null });

  return calculation.result;
};
