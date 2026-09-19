// Declare variables
let colourValue = 0;

function setup() {
    createCanvas(600, 600);
    background(220);
    // noLoop(); // Stops continuous drawing
  }
  
function draw() {
  // Recap 1: Repeating Circles
  // circle(75, 200, 100);
  // circle(225, 200, 100);
  // circle(375, 200, 100);
  // circle(525, 200, 100);

  // let num = 5;
  // let a = 10;
  // let b = 20;
  // const pi = 3.14159;
  // const gravity = 9.81;

  // let one_word = 1; // Python: snake_case
  // let oneWordTwoWords = 2;  // JS: camelCase

  // for i in range(0, 10, 1):  // Python
  //   print(i); // 0 - 9

  // for (let i = 0; i < 10; i++) {
  //   console.log(i);
  // }
  // for (let i = 10; i >= 0; i--) {
  //   console.log(i);
  // }
  // Task 1: Colour Gradient
  // let red = 10;
  // let green = 10;
  // let blue = 0;
  // for (let i = 0; i < 5; i++) {
  //   fill(red + i * 50, green + i * 50, blue);
  //   circle(50 + i * 50, 100, 40);
  // }

  // Task 2: Colour Loop
  // circle(100, 100, 100);  // (x, y, diameter)
  // fill(colourValue);  // (grayscale) 0 - 255 black to white
  // colourValue++;

  // Task 3: Row of Circles
  // for (let i = 0; i <= 5; i++) {
  //   if (i % 2 == 0) {
  //     fill(0);
  //   } else {
  //     fill(255);
  //   }
    
  //   circle(50 + i * 50, 100, 40);
  // }

  // Task 4: Grid of Circles
  // for (row = 0; row < 5; row++) {
  //   for (col = 0; col < 5; col++) {
  //     if ((row + col) % 2 == 0) {
  //       fill(0);
  //     } else {
  //       fill(255);
  //     }
      
  //     rect(col * 50, row * 50, 50, 50);
  //   }
  // }

  // circle(width / 2, height / 2, height);

  let circleDiameter = 30;
  let numCircles = 10;
  let totalWidth = numCircles * circleDiameter;

  // Calculate starting x for centering​
  let startX = (width - totalWidth) / 2 + circleDiameter / 2;
  let startY = (height - totalWidth) / 2 + circleDiameter / 2;

  for (row = 0; row < 10; row++) {
    // Each row's starting y-pos
    let rowY = startY + (circleDiameter * row);

    for (let i = 0; i < numCircles; i++) {
      let x = startX + i * circleDiameter;
      ellipse(x, rowY, circleDiameter, circleDiameter);
    }
  }
  
}