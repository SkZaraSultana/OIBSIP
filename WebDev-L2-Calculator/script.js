const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let previousInput = "";
let selectedOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput || "0";

    if (previousInput && selectedOperator) {
        previousDisplay.textContent = `${previousInput} ${getOperatorSymbol(selectedOperator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function getOperatorSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator];
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (number === "." && currentInput === "") {
        currentInput = "0";
    }

    currentInput += number;
    updateDisplay();
}

function chooseOperator(operator) {
    if (currentInput === "" && previousInput === "") {
        return;
    }

    if (currentInput !== "" && previousInput !== "" && selectedOperator) {
        calculate();
    }

    if (currentInput !== "") {
        previousInput = currentInput;
        currentInput = "";
    }

    selectedOperator = operator;
    shouldResetDisplay = false;
    updateDisplay();
}

function calculate() {
    if (previousInput === "" || currentInput === "" || !selectedOperator) {
        return;
    }

    const firstNumber = parseFloat(previousInput);
    const secondNumber = parseFloat(currentInput);

    let result;

    switch (selectedOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                showError("Cannot divide by zero");
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentInput = formatResult(result);
    previousInput = "";
    selectedOperator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function formatResult(result) {
    if (!Number.isFinite(result)) {
        return "Error";
    }

    return Number(result.toFixed(10)).toString();
}

function clearCalculator() {
    currentInput = "";
    previousInput = "";
    selectedOperator = null;
    shouldResetDisplay = false;

    updateDisplay();
}

function backspace() {
    if (shouldResetDisplay) {
        return;
    }

    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function showError(message) {
    currentInput = message;
    previousInput = "";
    selectedOperator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;

        if (number !== undefined) {
            appendNumber(number);
        } else if (operator !== undefined) {
            chooseOperator(operator);
        } else if (action === "calculate") {
            calculate();
        } else if (action === "clear") {
            clearCalculator();
        } else if (action === "backspace") {
            backspace();
        }
    });
});

updateDisplay();