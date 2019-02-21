let pressed = false;
let points = [];
let c;
let wb;
let guess;
function preload(){
    wb = loadJSON("https://rutheniumvi.github.io/Digit-Recognizer/data.json");
}
function sigmoid(x){
    return math.dotDivide(1,math.add(1,math.exp(math.dotMultiply(-1,x))))
}
function calculate(a){
    for(var i=0;i<wb[0].length;i++){
        a=sigmoid(math.add(math.multiply(math.matrix(wb[0][i]),a),math.matrix(wb[1][i])));
    }
    return a;
}

function setup(){     
    createCanvas(500,500);
    pixelDensity(1);
    let button = createButton("Reset");
    button.mousePressed(()=>{
        background(0);
        guess.html("Draw a digit");
        points=[];
    });
    button.position(200,510);
    button.size(150,50);
    background(0);
    stroke(255);
    noFill();
    strokeWeight(25);

    let text = createP("The computer thinks its a:")
    text.position(600,100);
    text.style('font-size','40px');
    guess = createP("Draw a digit");
    guess.position(750,200);
    guess.style('font-size','40px');
}
function mousePressed(){
    if(mouseX<500&mouseY<500){
        pressed=true;
    }else{
        pressed=false;
    }
    //beginShape();
}
function mouseReleased(){
    pressed=false;
    if(mouseX>500||mouseY>500){
        return false;
        points=[];
    }
    points=[];
    let img = createImage(500,500);
    loadPixels();
    img.loadPixels();
    for(var i=0;i<height;i++){
        for(var j=0;j<width;j++){
            let index=(j+i*width)*4;
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
    image(img,0,0);
    //let temp = getData(img);
    
    //image(img, 100,100);
    //img.style("border-style","solid");
    //img.loadPixels();
    //img.loadPixels();
    //console.log(getData(img));


    let temp = math.matrix(getData(img)).reshape([784,1]);
    let result = calculate(temp);
    let highest = 0;
    let index;
    for(var i=0;i<result.size()[0];i++){
        if(result.get([i,0])>highest){
            highest = result.get([i,0]);
            index=i;
        }
    }
    guess.html(str(index));
    console.log(result);
    console.log("The number is",index);             
}
function getData(img){
    let outArr = []
    img.loadPixels();
    for(var i=0;i<img.height;i++){
        for(var j=0;j<img.width;j++){
            let index=(j+i*img.width)*4;
            //console.log(img.pixels[index]);
            outArr.push((0.299 * img.pixels[index]) + (0.587 * img.pixels[index+1]) + (0.114 * img.pixels[index+2]));
        }
    }
    return outArr;
}


function draw(){
    if(pressed==true){
        points.push([mouseX,mouseY]);
        beginShape();
        for(let i of points){
            vertex(i[0],i[1]);
        }
        endShape();
    }
    
}
