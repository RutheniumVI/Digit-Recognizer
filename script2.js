let canvas2;
function setup(){
    createCanvas(500,500);
    //background(0);
    canvas2 = createGraphics(100,100);
    let button = createButton("Reset");
    button.mousePressed(()=>{
        //background(0);
        loadPixels();
        console.log(pixels);
        points=[];
    });
    button.position(200,210);
    button.size(150,50);
}
function draw(){
    canvas2.background(100);
    canvas2.noStroke();
    image(canvas2, 0, 0);
    
}