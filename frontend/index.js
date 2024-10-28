import { backend } from 'declarations/backend';

let currentValue = '0';
let operator = null;
let previousValue = null;

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const loadingIndicator = document.getElementById('loading');

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.dataset.value));
});

function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        appendNumber(value);
    } else if (['+', '-', '*', '/'].includes(value)) {
        setOperator(value);
    } else if (value === '=') {
        calculate();
    } else if (value === 'C') {
        clear();
    }
}

function appendNumber(number) {
    if (currentValue === '0' && number !== '.') {
        currentValue = number;
    } else {
        currentValue += number;
    }
    updateDisplay();
}

function setOperator(op) {
    if (operator !== null) {
        calculate();
    }
    operator = op;
    previousValue = currentValue;
    currentValue = '0';
}

async function calculate() {
    if (operator === null || previousValue === null) return;

    loadingIndicator.style.display = 'block';

    try {
        const result = await backend.calculate(parseFloat(previousValue), parseFloat(currentValue), operator);
        currentValue = result.toString();
        operator = null;
        previousValue = null;
        updateDisplay();
    } catch (error) {
        currentValue = 'Error';
        updateDisplay();
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function clear() {
    currentValue = '0';
    operator = null;
    previousValue = null;
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentValue;
}
