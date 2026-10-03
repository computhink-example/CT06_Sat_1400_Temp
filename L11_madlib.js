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
    nounField.position(width / 2 + offsetX, height / 2 + offsetY);
    verbField.position(width / 2 + offsetX, height / 2 + offsetY + 50);
    adjectiveField.position(width / 2 + offsetX, height / 2 + offsetY + 10);
    adverbField.position(width / 2 + offsetX, height / 2 + offsetY + 2);
    placeField.position(width / 2 + offsetX, height / 2 + offsetY + 50);
}

function draw() {

}