// Elements from the HTML that will be used
const result = document.getElementById('result');
const height = document.getElementById('height');
const weight = document.getElementById('weight');
const bmiNeedle = document.getElementById('needle');

const numberDisplay = document.getElementById('numberDisplay');
const typeDisplay = document.getElementById('typeDisplay');

// Constants for BMI categories
const minBmi = 0;         // Minimum BMI value
const maxBmi = 34;        // Maximum limit of BMI
const maxUnder = 18.4;    // Upper limit for Underweight
const maxNormal = 24.9;   // Upper limit for Normal weight
const maxOver = 29.9;     // Upper limit for Overweight

// Reset the BMI form
const resetBMI = () => {
    weight.value = "";
    height.value = "";
    result.innerHTML = "Enter your height and weight to know your BMI";
    bmiNeedle.style.transform = `translateX(-50%) rotate(${calculateDegree(25)}deg)`; // Reset needle to midpoint
    numberDisplay.innerText = "25"; // Reset display number
    typeDisplay.innerText = "Healthy"; // Reset display type
    typeDisplay.style.color = "green"; // Reset color
};

// Run the BMI calculation
const runBMI = () => {
    let h = height.value / 100; // Convert height to meters
    let w = weight.value;

    // Validation
    if (!h || !w || isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        result.innerHTML = `<h3 class="text-danger">Please enter a valid height and weight</h3>`;
        speakText("Please enter a valid height and weight");
        numberDisplay.innerText = "";
        typeDisplay.innerText = "";
        return;
    }

    // Calculate BMI
    let bmi = (w / (h ** 2)).toFixed(2);
    console.log(bmi);
    let resultMessage = '';

    // Determine BMI category
    if (bmi < 18.5) {
        resultMessage = "You are Underweight";
        result.innerHTML = `<h3 class="text-danger">${resultMessage}</h3>`;
    } else if (bmi <= 24.9) {
        resultMessage = "You are in Normal weight";
        result.innerHTML = `<h3 class="text-success">${resultMessage}</h3>`;
    } else if (bmi <= 29.9) {
        resultMessage = "You are Overweight";
        result.innerHTML = `<h3 class="text-warning">${resultMessage}</h3>`;
    } else {
        resultMessage = "You are Obese";
        result.innerHTML = `<h3 class="text-danger">${resultMessage}</h3>`;
    }

    // Make the result audible
    speakText(resultMessage);

    // Move the needle based on the BMI result
    bmiNeedle.style.transform = `translateX(-50%) rotate(${calculateDegree(bmi)}deg)`;

    // Update the number and category display
    numberDisplay.innerText = bmi;
    const quadrant = getQuadrant(bmi);  // Determines the category
    typeDisplay.innerText = typeDisplayArr[quadrant].text;
    typeDisplay.style.color = typeDisplayArr[quadrant].color;
};

// Calculate the degree for the needle
const calculateDegree = (bmi) => {
    // Ensure needle stays within acceptable ranges
    const currentVal = bmi >= maxBmi ? maxBmi : bmi < minBmi ? minBmi : bmi;

    // Determine the quadrant (BMI category)
    const quadrant = currentVal <= maxUnder ? 0
        : currentVal <= maxNormal ? 1
        : currentVal <= maxOver ? 2
        : 3;

    // Return the angle based on the quadrant and value
    return (percentOfRangeByQuadrant(currentVal, quadrant) * 45) + (quadrant * 45);
};

// Calculate the percentage of the value within its quadrant range
const percentOfRangeByQuadrant = (value, quadrant) => {
    const quad = rangebyQuadrant[quadrant];
    const percentOfRange = (Number(value) - quad.min) / (quad.max - quad.min);
    return percentOfRange === 0 ? 0.01 : percentOfRange;
};

// Speak the result message
const speakText = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        result.innerHTML += "<p>Sorry, your browser does not support text-to-speech.</p>";
    }
};

// Mapping quadrants to categories (for type display)
const typeDisplayArr = [
    { text: 'Underweight', color: 'blue' },
    { text: 'Normal weight', color: 'green' },
    { text: 'Overweight', color: 'orange' },
    { text: 'Obese', color: 'red' }
];

// Range of BMI for each quadrant
const rangebyQuadrant = [
    { min: 0, max: 18.4 },
    { min: 18.5, max: 24.9 },
    { min: 25, max: 29.9 },
    { min: 30, max: 34 }
];

// Determine the quadrant (BMI category)
const getQuadrant = (bmi) => {
    if (bmi <= maxUnder) return 0;
    if (bmi <= maxNormal) return 1;
    if (bmi <= maxOver) return 2;
    return 3;
};
