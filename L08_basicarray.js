// Recap
// let squareX = 300;
// let squareY = 200;
// let squareSpeed = 5;

// function setup() {
//     createCanvas(600, 400);
//     background(220);
// }

// function draw() {
//     // Reset canvas / clear screen
//     background(220);

//     // Movement
//     // if square's x pos goes past right or left side
//     // width - square size
//     if (squareX > width - 100 || squareX < 0) {
//         // invert the speed to change directions
//         // positive to negative and negative to positive
//         squareSpeed *= -1;
//     }

//     squareX += squareSpeed;

//     fill(255, 255, 0);
//     rect(squareX, squareY, 100, 100); // (x pos, y pos, width, height)
// }

let favouriteFoods = ["Apple", "Banana", "Cherry"];
let yPos = 400;

function setup() {
    createCanvas(600, 400);
    background(220);

    // Write text on canvas
    // text("Hello!", width / 2, height / 2); // (string, x pos, y pos)
}

function draw() {
    // Reset canvas / clear screen
    background(220);

    // Set text size
    textSize(40);
    // Align text
    textAlign(CENTER, CENTER); // (horizontal, vertical)
    
    for (let i = 0; i < favouriteFoods.length; i++) {
        text((i + 1) + ". " + favouriteFoods[i], width / 2, yPos + i * 50);
    }
    yPos -= 1;
}