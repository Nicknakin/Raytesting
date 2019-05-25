let walls = [];
let letFill = true;
let viewDistance = Infinity;
let showWalls = false;
let numRays = 950;
let i = 0;
let speed = 5;
let gridDimensions = [38, 18, 50];
let lookAngle = 0;
let fov = 110;
let rotating = true;
let mapBuffer, tDBuffer, vertices, ray;

function setup(){
    let canvas = createCanvas(1900,900);
    tDBuffer = createGraphics(width, height);
    mapBuffer = createGraphics(width, height);
    ray = new Ray(width/2, height/2, mapBuffer);
    createGrid(gridDimensions);
    randomize(); 
    colorMode(RGB, 255, 255, 255, 255)
}

function draw(){
    if(rotating) lookAngle = (lookAngle+.5)%360;
    ray.setViewDir(cos(radians(lookAngle)), sin(radians(lookAngle)));
    vertices = [];
    calcVertices(vertices);
    background(0);

    image(tDBuffer, 0, 0);

    if(!showWalls){
        drawMap(mapBuffer);
        image(mapBuffer, 0, 0);
    } else{
        tDBuffer.background(0);
        drawWalls3D(tDBuffer, vertices);
        drawMap(mapBuffer);
        mapBuffer.copy(floor(ray.pos.x-100), floor(ray.pos.y-100), 200, 200, 0, 0, 200, 200);
        image(mapBuffer, width-250, height-250, 200, 200, 0, 0 , 200, 200);
    }
}

function drawMap(context){
    mapBuffer.background(0);
        if(letFill) fillView(context, vertices);
        else drawRays(context, vertices);
        ray.show();
        walls.forEach((wall) => wall.show());
}

function createGrid(dims){
    for(let i = 0; i < dims[0]*dims[2]; i += dims[2]){
        for(let k = 0; k < dims[1]*dims[2]; k += dims[2]){
            walls.push(new Boundary(i, k+dims[2], i+dims[2], k+dims[2], mapBuffer));
            walls.push(new Boundary(i+dims[2], k+dims[2], i+dims[2], k, mapBuffer));
        }
    }
}

function randomize(){
    for(let i = walls.length/4; i < walls.length; i++){
        let k = random(walls.length);
         walls.splice(k, 1);  
    }
    walls.push(new Boundary(0,0,0,height, mapBuffer));
    walls.push(new Boundary(0,height,width,height, mapBuffer));
    walls.push(new Boundary(width,height,width,0, mapBuffer));
    walls.push(new Boundary(0,0,width,0, mapBuffer));
}

function drawRays(bufferContext, vertices){
    bufferContext.fill(128);
    bufferContext.stroke(128);
    vertices.forEach(vertex => bufferContext.line(ray.pos.x, ray.pos.y, vertex.x, vertex.y));
}

function fillView(bufferContext, vertices){
    vertices.push(ray.pos);
    bufferContext.fill(128);
    bufferContext.stroke(128);
    bufferContext.beginShape();
    for(vert in vertices){
        if(vertices[vert]){
            bufferContext.vertex(vertices[vert].x, vertices[vert].y);
        }
    }

    bufferContext.endShape(CLOSE);
}

function drawWalls3D(bufferContext, vertices){
    push();
    bufferContext.rectMode(CENTER);
    for(viewPoint in vertices){
        let p = vertices[viewPoint];
        bufferContext.fill(255/p.z*gridDimensions[2]/2);
        bufferContext.stroke(255/p.z*gridDimensions[2]/2);
        bufferContext.rect(viewPoint*width/numRays, height/2, width/numRays, height*20/p.z);
    }       
    pop();
}

function calcVertices(){
    for(let i = ray.getViewDir()-fov/2; i < ray.getViewDir()+fov/2; i+=fov/numRays){
        ray.setAngle(cos(radians(i)), sin(radians(i)));
        let closest = createVector(ray.pos.x+ray.dir.x*viewDistance, ray.pos.y+ray.dir.y*viewDistance);
        let record = viewDistance;
        for(wall in walls){
            let pt = ray.cast(walls[wall]);
            if(pt){
                let dist = p5.Vector.dist(pt, ray.pos);
                if(dist < record){
                    record = dist;
                    closest = pt;
                }
            }
        }
        if(record < Infinity){
            vertices.push(createVector(closest.x, closest.y, closest.z));
        }   
    }
}

function mousePressed(){
    if(!showWalls) ray.pos = createVector(mouseX, mouseY);
}

function keyTyped(){
    if(key == "m") showWalls = !showWalls;
    if(key == " ") rotating = !rotating;
    if(key == "n") letFill = !letFill;
}


