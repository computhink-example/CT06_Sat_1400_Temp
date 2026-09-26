let inputText; // Stores user input
let displayText = "Your Name Here"; // Text to display on canvas

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
}

function draw() {
    background(0);

    text(displayText, width / 2, height * 0.3);
}

function updateText() {
    // Save input to displayText whenever user types
    displayText = this.value();
    console.log(displayText);
}