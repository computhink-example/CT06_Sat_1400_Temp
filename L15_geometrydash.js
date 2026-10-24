let playerX = 100;
let playerY;
let playerSize = 30;
let velocity = 0;
let isGrounded = false;

let spikesX = [];
let spikeWidth = 20;
let spikeHeight = 30;
let spikeSpeed = 5;

let gameOver = false;

function setup() {
    createCanvas(600, 400);
    textAlign(CENTER, CENTER);
    playerY = height - playerSize; // Bottom of screen

    // Create a set of spikes
    for (let i = 0; i < 3; i++) {
        spikesX.push(width + i * 300);
    }
}

function draw() {
    background(0);
    
    // if game is NOT over (false)
    if (!gameOver) {
        // Gravity
        velocity += 0.8;
        playerY += velocity;
        
        // Prevent player from falling through the ground
        if (playerY >= height - playerSize) {    
            playerY = height - playerSize; // Bottom of screen
            isGrounded = true;
            velocity = 0;
        } else {
            // Prevent jumping when in the air
            isGrounded = false;
        }
        
        // Draw player
        fill(255, 255, 0); // (r, g, b)
        rect(playerX, playerY, playerSize, playerSize); // (x, y, width, height)
        
        // Draw spikes
        fill(255, 0, 0);
        for (let i = 0; i < spikesX.length; i++) {
            // Make spikes move to the left
            spikesX[i] -= spikeSpeed;
        
            // Check when spikes go past the left side
            if (spikesX[i] < -spikeWidth) {
                spikesX[i] = width + random(100, 300);
            }
        
            // Draw each spike
            triangle(spikesX[i], height, spikesX[i] + spikeWidth / 2, height - spikeHeight, spikesX[i] + spikeWidth, height);

            // Collision detection
            if (
                playerX + playerSize > spikesX[i] &&
                playerX < spikesX[i] + spikeWidth &&
                playerY + playerSize > height - spikeHeight
            ) {
                gameOver = true;
            }
        }
    } else {
        // Game is over
        fill(255, 0, 0);
        textSize(40);
        text("Game Over!", width / 2, height / 2); // (string, x, y)
    }
}

// Called automatically when a key is pressed
function keyPressed() {
    // Jump when space key is pressed and player is on the ground
    if (key === " " && isGrounded === true) {
        velocity = -12; // Jump power
    }
}