let yPos; // Text y pos
let storyText = [
    "A long time ago in a galaxy far,",
    "far away...",
    "", // Empty line
    "EPISODE I",
    "THE BEGINNING",
    "", // Empty line
    "It is a period of civil war.",
    "Rebel spaceships, striking",
    "from a hidden base, have",
    "won their first victory",
    "against the evil Galactic",
    "Empire."
];

let bgMusic;

function preload() {
    bgMusic = loadSound("assets/star_wars_theme_8_bit.mp3");
}

function setup() {
    createCanvas(600, 400);
    textAlign(LEFT, CENTER);
    textSize(24);
    fill("rgb(255, 255, 0)");

    // Set starting y pos
    yPos = height;

    // Start BGM
    bgMusic.loop();
}

function draw() {
    // Reset canvas / clear screen
    background(0);

    // Loop through array
    for (let i = 0; i < storyText.length; i++) {
        text(storyText[i], width / 4, yPos + i * 40); // (string, x pos, y pos)
    }
    // Decrease y to move up
    yPos -= 0.5;
}