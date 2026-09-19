// // Recap 1
// let picoImage;
// let popSound;

// let x = 0;
// let y = 0;
// let picoWidth = 100;

// function preload() {
//     picoImage = loadImage("assets/pico-a.png");
//     popSound = loadSound("assets/pop.mp3");
// }

// function setup() {
//     createCanvas(600, 400);
// }

// function draw() {
//     background("gray");

//     // Movement
//     if (keyIsDown(UP_ARROW)) {
//         y -= 5;
//     }
//     if (keyIsDown(DOWN_ARROW)) {
//         y += 5;
//     }
//     if (keyIsDown(LEFT_ARROW)) {
//         x -= 5;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//         x += 5;
//     }

//     // Constrain static image within canvas boundaries
//     x = constrain(x, 0, width - 100);   // (variable, min, max)
//     y = constrain(y, 0, height - 100);

//     // Draw pico
//     image(picoImage, x, y, picoWidth, 100);  // (image, x pos, y pos, width, height)
// }

// function keyPressed() {
//     // Spacebar to trigger sound effect
//     if (key === " ") { 
//         popSound.play();
//         picoWidth = 50;
//     }
// }

// function keyReleased() {
//     if (key === " ") { 
//         picoWidth = 100;
//     }
// }

let ballX = 300;
let ballY = 200;
let ballSize = 50;
let ballSpeedX = 2;
let ballSpeedY = 2;

function setup() {
    createCanvas(600, 400);
    background(220); // (0 - 255) grayscale
}

function draw() {
    // Reset canvas / clear screen
    // background(220);

    // Movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce on edge - invert speed
    if (ballX <= 0 + ballSize / 2 || ballX >= width - ballSize / 2) {
        ballSpeedX *= -1;
        fill(random(255), random(255), random(255));
    }
    if (ballY <= 0 + ballSize / 2 || ballY >= height - ballSize / 2) {
        ballSpeedY *= -1;
        fill(random(255), random(255), random(255));
    }

    // stroke - outline, fill - colour
    noStroke(); // Remove outline

    circle(ballX, ballY, ballSize); // (x, y, diameter)
}