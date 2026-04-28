let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = null;
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    
    currentInput += number;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && previousValue === null) {
        return;
    }
    
    if (currentInput === '' && operator !== null) {
        operator = op;
        return;
    }
    
    if (previousValue === null) {
        previousValue = parseFloat(currentInput);
    } else if (operator) {
        previousValue = performCalculation(previousValue, currentInput, operator);
    }
    
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null || currentInput === '') {
        return;
    }
    
    const result = performCalculation(previousValue, currentInput, operator);
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function performCalculation(prev, current, op) {
    const a = parseFloat(prev);
    const b = parseFloat(current);
    
    switch(op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return 0;
            }
            return a / b;
        default:
            return b;
    }
}

function clearDisplay() {
    currentInput = '';
    operator = null;
    previousValue = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}

// Initialize display
updateDisplay();