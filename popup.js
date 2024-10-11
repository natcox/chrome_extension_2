let expression = ""; // Holds the current expression
let history = []; // Holds the history of calculations
const display = document.getElementById("display"); // Get the calculator display input

// Function to update the display
function updateDisplay() {
    display.value = expression || "0"; // Show "0" if the expression is empty
}

// Function to safely evaluate the expression
function calculateExpression(expr) {
    try {
        const operators = expr.match(/[\+\-\*\/]/g);
        const numbers = expr.split(/[\+\-\*\/]/).map(Number);

        if (!operators || numbers.length === 1) {
            return numbers[0].toString(); // Return the number if it's a single number
        }

        let result = numbers[0];
        for (let i = 0; i < operators.length; i++) {
            const operator = operators[i];
            const nextNumber = numbers[i + 1];

            switch (operator) {
                case '+':
                    result += nextNumber;
                    break;
                case '-':
                    result -= nextNumber;
                    break;
                case '*':
                    result *= nextNumber;
                    break;
                case '/':
                    if (nextNumber === 0) {
                        throw new Error("Division by zero");
                    }
                    result /= nextNumber;
                    break;
            }
        }
        return result.toString();
    } catch (e) {
        return "Error"; // Return error if the expression is invalid
    }
}

// Function to update the history display
function updateHistoryDisplay() {
    const historyDisplay = document.getElementById('historyDisplay');
    historyDisplay.innerHTML = history.join('<br>'); // Display the history as line breaks
}

// Function to apply the selected theme
function applyTheme(theme) {
    document.body.className = theme; // Apply the selected theme
    localStorage.setItem('theme', theme); // Save the theme to localStorage
}

// Load the saved theme on startup
window.onload = function() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
};

// Add event listener for theme change
document.getElementById('themeSelect').addEventListener('change', function() {
    applyTheme(this.value); // Change the theme based on selection
});

// Add event listener to each button
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", function() {
        const value = button.textContent;

        if (value === "=") {
            const result = calculateExpression(expression);
            history.push(`${expression} = ${result}`);
            expression = result; // Update expression to the result for further calculations
        } else if (value === "C") {
            expression = ""; // Clear the expression
        } else if (value === "Clear History") {
            history = []; // Clear the history
            document.getElementById('historyDisplay').innerHTML = ''; // Clear the UI display
            return; // Prevent from adding to the expression
        } else {
            if (/[\+\*\/]$/.test(expression) && /[\+\*\/]/.test(value)) {
                return; // Prevent multiple operators in a row
            }
            if (expression === "" && /[+\*\/]/.test(value)) {
                return; // Prevent starting with an operator
            }
            expression += value; // Append the value to the expression
        }

        updateDisplay(); // Update the display
        updateHistoryDisplay(); // Update the history display
    });
});

// Enable keyboard input
window.addEventListener('keydown', function(event) {
    const key = event.key;

    if (/[0-9\+\-\*\/]/.test(key)) { // Allow numbers and operators
        expression += key;
    } else if (key === 'Enter') {
        const result = calculateExpression(expression);
        history.push(`${expression} = ${result}`);
        expression = result; // Update expression to the result for further calculations
    } else if (key === 'Backspace') {
        expression = expression.slice(0, -1); // Delete last character on Backspace
    }

    updateDisplay(); // Update display after each key press
});
