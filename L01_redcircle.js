function setup(){
    createCanvas(600, 400);
    background(220);
}

function draw(){
    fill(255, 0, 0);            // Colour inside shape (r, g, b)
    ellipse(300,100,100,100);   // (x, y, width, height) 
    
    // Todo: Challenge 3 Traffic Light
    fill(255, 255, 0);
    ellipse(300,200,100,100);

    fill(0, 255, 0);
    ellipse(300,300,100,100);
}