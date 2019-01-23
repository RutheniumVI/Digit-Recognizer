let img;
function setup(){
    createCanvas(640,430);
    img=loadImage("cigar.png");
}

function draw(){
    image(img, 100, 100, 100, 100);
}