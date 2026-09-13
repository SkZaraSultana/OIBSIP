const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertButton = document.getElementById("convertBtn");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");
const errorMessage = document.getElementById("errorMessage");

convertButton.addEventListener("click", convertTemperature);

function convertTemperature() {
    const inputValue = temperatureInput.value.trim();
    const inputUnit = unitSelect.value;

    // Clear previous error
    errorMessage.textContent = "";

    // Validate empty input
    if (inputValue === "") {
        showError("Please enter a temperature value.");
        clearResults();
        return;
    }

    const temperature = Number(inputValue);

    // Validate numeric input
    if (!Number.isFinite(temperature)) {
        showError("Please enter a valid numeric temperature.");
        clearResults();
        return;
    }

    let celsius;

    // Convert input to Celsius first
    if (inputUnit === "celsius") {
        celsius = temperature;
    } else if (inputUnit === "fahrenheit") {
        celsius = (temperature - 32) * 5 / 9;
    } else if (inputUnit === "kelvin") {
        celsius = temperature - 273.15;
    }

    // Absolute zero validation
    if (celsius < -273.15) {
        showError(
            "Invalid temperature. A temperature cannot be below absolute zero (-273.15°C)."
        );
        clearResults();
        return;
    }

    // Convert Celsius to all units
    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;

    // Display results
    celsiusResult.textContent = `${formatValue(celsius)} °C`;
    fahrenheitResult.textContent = `${formatValue(fahrenheit)} °F`;
    kelvinResult.textContent = `${formatValue(kelvin)} K`;
}

function formatValue(value) {
    return Number(value.toFixed(2));
}

function showError(message) {
    errorMessage.textContent = message;
}

function clearResults() {
    celsiusResult.textContent = "—";
    fahrenheitResult.textContent = "—";
    kelvinResult.textContent = "—";
}