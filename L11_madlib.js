let nounField;
let verbField;
let adjectiveField;
let adverbField;
let placeField;

function setup() {
    createCanvas(600, 600);

    // Set text settings
    fill(255, 255, 0);
    textSize(40);
    textAlign(CENTER, CENTER);

    // Create input fields
    nounField = createInput();
    verbField = createInput();
    adjectiveField = createInput();
    adverbField = createInput();
    placeField = createInput();

    // Offset to canvas position
    let offsetX = this.canvas.offsetLeft;
    let offsetY = this.canvas.offsetTop;

    // Position input fields
    nounField.position(width / 2 + offsetX, height * 0.2 + offsetY);
    verbField.position(width / 2 + offsetX, height * 0.2 + offsetY + 50);
    adjectiveField.position(width / 2 + offsetX, height * 0.2 + offsetY + 100);
    adverbField.position(width / 2 + offsetX, height * 0.2 + offsetY + 150);
    placeField.position(width / 2 + offsetX, height * 0.2 + offsetY + 200);
}

function draw() {
    // Reset canvas
    background(100);

    // Text beside input
    text("Enter a noun:", width * 0.2, height * 0.2)
    text("Enter a verb:", width * 0.2, height * 0.2 + 50)
    text("Enter a adjective:", width * 0.2, height * 0.2 + 100)
    text("Enter a adverb:", width * 0.2, height * 0.2 + 150)
    text("Enter a place:", width * 0.2, height * 0.2 + 200)
}