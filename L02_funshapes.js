/*
Task 1: Add the setup() function
*/
function setup() {
  createCanvas(600, 400);   // (width, height)
  background(255, 255, 0);  // Background colour
}

function draw() {
  // Challenge 1: An eye using ellipse() function
  // ellipse(300, 200, 500, 300); // (x, y, width, height)
  // ellipse(300, 200, 150, 300);
  // ellipse(300, 200, 150, 100);

  // Challenge 2: A face using circle() function
  // circle(300, 200, 250); // (x, y, diameter)
  // circle(175, 75, 100);
  // circle(425, 75, 100);
  // circle(250, 150, 30);
  // circle(350, 150, 30);
  // ellipse(300, 250, 150, 50);

  // Challenge 3: A house using rect() function
  // rect(50, 50, 500, 300);  // (x, y, width, height)
  // circle(175, 150, 100);
  // circle(425, 150, 100);
  // rect(250, 200, 100, 150);
  // ellipse(335, 275, 20, 30);

  // Challenge 4: A rocketship using triangle() function
  // triangle(300, 50, 450, 300, 150, 300);  // (x1, y1, x2, y2, x3, y3)
  
  // Challenge 5: A square face using quad() function
  strokeWeight(10); // Outline thickness
  stroke(70, 150, 250); // Outline colour (r, g, b)
  fill(66, 179, 245); // Fill colour (r, g, b)
  rect(100, 50, 400, 300);

  strokeWeight(5);  // Outline thickness
  stroke("#2a2b2a");  // Outline colour ("#hex")
  fill(150); // (grayscale 0-255)
  quad(200, 250, 400, 250, 350, 300, 250, 300); // (x1, y1, x2, y2, x3, y3, x4, y4)

  fill("#00dc04");  // ("#hex")
  ellipse(240, 170, 50, 70);

  // noFill(); // No fill colour
  fill("#ff54d7");  // ("#hex")
  ellipse(360, 200, 50, 50);
  fill("#ff5927");  // ("#hex")
  ellipse(100, 60, 90, 80);
  fill("#00ffd5");  // ("#hex")
  ellipse(500, 60, 90, 80);

  // Challenge 6: Add some colours to the drawings in the above challenges

  // Challenge 7: Create a funny Pokemon
}