let pressed = false;
let points = [];
let c;
let wb;

function setup(){
    wb = $.getJSON( "http://127.0.0.1:8887/data.json", function() {
        console.log( "success" );
    })      
    createCanvas(500,500);
    pixelDensity(1);
    // let button = createButton("Reset");
    // button.mousePressed(()=>{
    //     background(0);
    //     points=[];
    // });
    background(0);
    stroke(255);
    noFill();
    strokeWeight(10);
}
function mousePressed(){
    pressed=true;
    //beginShape();
}
function mouseReleased(){
    pressed=false;
    points=[];
    let img = createImage(500,500);
    loadPixels();
    img.loadPixels();
    for(var i=0;i<height;i++){
        for(var j=0;j<width;j++){
            let index=(i+j*width)*4;
            img.pixels[index]=pixels[index];
            img.pixels[index+1]=pixels[index+1];
            img.pixels[index+2]=pixels[index+2];
            img.pixels[index+3]=255;
        }
    }
    //img.pixels=pixels.slice(0); 
    //
    updatePixels();
    img.updatePixels();
    img.resize(28,28);
    //image(img, 100,100);
    //img.style("border-style","solid");
    //img.loadPixels();
    img.loadPixels();
    //console.log(img.pixels);
    //console.log(getData(img));


    //data writer
    // let writer = createWriter('sample.txt');
    // let temp = getData(img);
    // for(var i=0;i<temp.length;i++){
    //     if((i+1)%img.width!=0){
    //         writer.print("");
    //     }
    //     writer.print(temp[i],end=',');
    // }
    // writer.close();

    
    //getData();
}
function getData(img){
    let outArr = []
    img.loadPixels();
    for(var i=0;i<img.height;i++){
        for(var j=0;j<img.width;j++){
            let index=(i+j*img.width)*4;
            //console.log(img.pixels[index]);
            outArr.push((0.3 * img.pixels[index]) + (0.59 * img.pixels[index+1]) + (0.11 * img.pixels[index+2]));
        }
    }
    return outArr;
}


function draw(){
    if(pressed){
        points.push([mouseX,mouseY]);
        beginShape();
        for(let i of points){
            vertex(i[0],i[1]);
        }
        endShape();
    }
    
}