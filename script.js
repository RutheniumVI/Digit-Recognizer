let pressed = false;
let points = [];
let c;
let wb;
let guess;
let model;
let modelAug;
let select_bar;
let gray_scale_img;


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

async function setup(){     

    model = await tf.loadLayersModel('./weights/model.json');
    modelAug = await tf.loadLayersModel('./weights2/model.json');

    createCanvas(500,500);
    textAlign(CENTER);
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

    //select bar
    createSelectBar();

    let text = createP("The computer thinks its a:")
    text.position(600,100);
    text.style('font-size','40px');
    guess = createP("Draw a digit");
    guess.position(750,200);
    guess.style('font-size','40px');
}
function createSelectBar(){
    const x = 600;
    const y = 30;
    let text = createP("Choose the ML model: ");
    text.position(x, y);
    select_bar = createSelect();
    select_bar.position(x+150, y+15);
    select_bar.option('CNN');
    select_bar.option('Basic Neural Network');
    select_bar.option('CNN with Augmentation');
    select_bar.selected('kiwi');
    select_bar.changed(mySelectEvent);
}
function mySelectEvent() {
    let item = select_bar.value();
    let result;
    if(item=="CNN"){
        result = getCNNPrediction();
    }else if(item=="Basic Neural Network"){
        result = getNormalPrediction();
    }else if(item=="CNN with Augmentation"){
        result = getCNNAugPrediction();
    }
    console.log(item);
    setOutput(result);
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
        points=[];
        return false;
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
    //updatePixels();
    img.updatePixels();
    img.resize(28,28);
    gray_scale_img = getData(img);
    
    let result;
    if(select_bar.value()=="CNN"){
        result = getCNNPrediction();
    }else if(select_bar.value()=="Basic Neural Network"){
        result = getNormalPrediction();
    }else if(select_bar.value()=="CNN with Augmentation"){
        result = getCNNAugPrediction();
    }
    setOutput(result);    
}
function setOutput(result){
    guess.html(str(result));
    console.log("The number is",result); 
}
function getCNNPrediction(){
    let normalized = [];
    let ind = 0;
    for(var i=0;i<28;i++){
        let inner_arr = [];
        for(var j=0;j<28;j++){
            inner_arr.push([gray_scale_img[ind++]/255.0]);
        }
        normalized.push(inner_arr);
    }
    let result = model.predict(tf.tensor([normalized])).dataSync();
    let index;
    let highest = 0.0;
    for(var i=0;i<result.length;i++){
        if(result[i]>highest){
            highest = result[i];
            index=i;
        }
    }
    return index;

}
function getCNNAugPrediction(){
    let normalized = [];
    let ind = 0;
    for(var i=0;i<28;i++){
        let inner_arr = [];
        for(var j=0;j<28;j++){
            inner_arr.push([gray_scale_img[ind++]/255.0]);
        }
        normalized.push(inner_arr);
    }
    let result = modelAug.predict(tf.tensor([normalized])).dataSync();
    let index;
    let highest = 0.0;
    for(var i=0;i<result.length;i++){
        if(result[i]>highest){
            highest = result[i];
            index=i;
        }
    }
    return index;

}
function getNormalPrediction(){
    let temp = math.matrix(gray_scale_img);
    temp = temp.reshape([784,1]);
    let result = calculate(temp);
    let highest = 0;
    let index;
    for(var i=0;i<result.size()[0];i++){
        if(result.get([i,0])>highest){
            highest = result.get([i,0]);
            index=i;
        }
    }
    return index;
}
function getHighest(){

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
