let nounField;
let verbField;
let adjectiveField;
let adverbField;
let placeField;
let submitButton;

function setup() {
    createCanvas(600, 600);

    // Set text settings
    fill(255, 255, 255);
    textSize(30);
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

    // Create button
    submitButton = createButton("Generate Story");
    submitButton.position(width / 2 + offsetX, height * 0.2 + offsetY + 250);
    // Trigger a function when clicked
    submitButton.mousePressed(generateStory);
}

function draw() {
    // Reset canvas
    background(200);

    // Text beside input
    text("Enter a noun:", width * 0.2, height * 0.2);
    text("Enter a verb:", width * 0.2, height * 0.2 + 50);
    text("Enter a adjective:", width * 0.2, height * 0.2 + 100);
    text("Enter a adverb:", width * 0.2, height * 0.2 + 150);
    text("Enter a place:", width * 0.2, height * 0.2 + 200);
}

// Function for button to trigger when clicked
function buttonExample() {
    console.log("Button Clicked!");
}

function generateStory() {
    // Get value from all input fields
    let noun = nounField.value();
    let verb = verbField.value();
    let adjective = adjectiveField.value();
    let adverb = adverbField.value();
    let place = placeField.value();

    // python f-string (f"a {noun} is {verb}ing")
    // js templates "a ${noun} is ${verb}ing"

    let story = `A ${noun} is ${verb}ing.`;

    console.log(story);
}