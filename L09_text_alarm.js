// let hr;
// let min;
// let sec;
// let timeString;

// let intervalId;

// function setup() {
//     createCanvas(600, 400);
//     // textAlign(CENTER, CENTER);
//     // textSize(40);
//     // fill("rgb(255, 255, 50)");
// }

// function draw() {
//     // Reset canvas / clear screen
//     background(0);

//     // Set to current time
//     hr = hour();    // Returns current hour
//     min = minute(); // Returns current minute
//     sec = second(); // Returns current second

//     // nf = number format, nf(number, digits)
//     timeString = nf(hr, 2) + " : " + nf(min, 2) + " : " + nf(sec, 2);

//     text(timeString, width / 2, height / 2);
// }

// let x = 0;

let intervalId; // Used to stop the interval

let countdown = 5;
let countdownStart = false;

function setup() {
    createCanvas(600, 400);

    // Set up text settings
    fill(255, 0, 0);
    textSize(40);

    // Creates a loop to call drawCircle every 1000ms (1 second)
    // intervalId = setInterval(drawCircle, 1000);
}

function draw() {
    // Reset canvas / clear screen
    background(0);

    text(countdown, width / 2, height / 2);
}

function drawCircle() {
    clear();
    circle(x, 50, 20); // circle(x pos, y pos, diameter)
    x += 10; // Move circle right
    if (x > 200) {
        x = 0;
    }
}

// This function is called whenever you click your mouse
function mousePressed() {
    // Stop an interval using its ID
    // clearInterval(intervalId);

    if (countdownStart === false) {
        // Prevent multiple intervals
        countdownStart = true;
        countdown = 5;
        intervalId = setInterval(updateCountdown, 1000);
    }
}

function updateCountdown() {
    countdown--;

    // Stop interval after countdown reaches 0
    if (countdown <= 0) {
        countdown = 0;
        clearInterval(intervalId);
        // Allow timer to restart
        countdownStart = false;
    }
}