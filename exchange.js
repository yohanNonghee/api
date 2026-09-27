// DOM Elements Configuration
const currencyOne = document.getElementById('currency-one'); // First currency selection dropdown
const currencyTwo = document.getElementById('currency-two'); // Second currency selection dropdown
const amountOne = document.getElementById('amount-one'); // Input field for the first currency amount
const amountTwo = document.getElementById('amount-two'); // Input field for the second currency amount
const rateText = document.getElementById('rate'); // Element to display the exchange rate text
const swapButton = document.getElementById('btn'); // Button to swap currencies and values

// Main calculation function (processed top-to-bottom: currencyOne -> currencyTwo)
async function calculate() {
    const currency1 = currencyOne.value;
    const currency2 = currencyTwo.value;

    try {
        // Fetch exchange rates based on the first currency
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency1}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const rate = data.rates[currency2];

        // Display exchange rates
        rateText.innerText = `1 ${currency1} = ${rate} ${currency2}`;
        
        // Calculate the value of the bottom cell based on the top cell
        const val1 = parseFloat(amountOne.value) || 0;
        amountTwo.value = (val1 * rate).toFixed(2);
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        rateText.innerText = 'Failed to load exchange rate.';
    }
}

// Event Listeners for changing currency dropdowns or typing in the top input field
currencyOne.addEventListener('change', calculate);
currencyTwo.addEventListener('change', calculate);
amountOne.addEventListener('input', calculate);

// Event Listener for typing in the bottom input field (calculating back to the top field)
amountTwo.addEventListener('input', async () => {
    const currency1 = currencyOne.value;
    const currency2 = currencyTwo.value;

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency1}`);
        const data = await response.json();
        const rate = data.rates[currency2];

        // Calculate and update the top field based on the bottom field value
        const val2 = parseFloat(amountTwo.value) || 0;
        if (rate > 0) {
            amountOne.value = (val2 / rate).toFixed(2);
        }
    } catch (error) {
        console.error('Error calculating reverse rate:', error);
    }
});

// Currency and numeric value swap button event listener
swapButton.addEventListener('click', () => {
    // Swap the selected values of both dropdowns
    const tempCurrency = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = tempCurrency;

    // Swap the values of both input fields
    const tempAmount = amountOne.value;
    amountOne.value = amountTwo.value;
    amountTwo.value = tempAmount;

    // Recalculate after swapping
    calculate();
});

// Runs for the first time when the page loads to initialize exchange rates and values
calculate();
