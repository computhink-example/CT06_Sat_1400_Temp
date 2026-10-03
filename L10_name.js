let inputText; // Stores user input
let displayText = "Your Name Here"; // Text to display on canvas
let colourPicker;

function setup() {
    createCanvas(600, 400);

    // Set text settings
    fill(255, 255, 0);
    textSize(40);
    textAlign(CENTER, CENTER);

    // Create input field
    inputText = createInput();
    // Shift input field into canvas
    let inputX = this.canvas.offsetLeft + (width / 2) - 80;
    let inputY = this.canvas.offsetTop + (height / 2) - 10;
    inputText.position(inputX, inputY);

    // Call updateText when user types
    inputText.input(updateText);

    // Create colour picker
    colourPicker = createColorPicker();
    let colourX = this.canvas.offsetLeft + (width / 2) - 20;
    let colourY = this.canvas.offsetTop + (height * 0.7);
    colourPicker.position(colourX, colourY);
}

function draw() {
    // Set background colour to colourPicker value
    background(colourPicker.value());

    text(displayText, width / 2, height * 0.3);
}

function updateText() {
    // Save input to displayText whenever user types
    displayText = this.value();
    console.log(displayText);
}