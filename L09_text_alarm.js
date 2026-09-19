let hr;
let min;
let sec;
let timeString;

function setup() {
    createCanvas(600, 400);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("rgb(255, 255, 50)");
}

function draw() {
    // Reset canvas / clear screen
    background(0);

    // Set to current time
    hr = hour();    // Returns current hour
    min = minute(); // Returns current minute
    sec = second(); // Returns current second

    // nf = number format, nf(number, digits)
    timeString = nf(hr, 2) + " : " + nf(min, 2) + " : " + nf(sec, 2);

    text(timeString, width / 2, height / 2);
}