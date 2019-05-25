let walls = [];
let letFill = true;
let viewDistance = Infinity;
let showWalls = false;
let numRays = 500;
let i = 0;
let speed = 5;
let gridDimensions = [38, 18, 50];
let lookAngle = 0;
let fov = 110;
let rotating = !true;
let mapBuffer, tDBuffer, vertices, ray;

function setup(){
    let canvas = createCanvas(1900,900);
    tDBuffer = createGraphics(width, height);
    mapBuffer = createGraphics(width, height);
    ray = new Ray(width/2-gridDimensions[2]/2, height/2-gridDimensions[2]/2, mapBuffer);
    createGrid(gridDimensions);
    randomize(); 
    colorMode(RGB, 255, 255, 255, 255);
    tDBuffer.colorMode(RGB, 255, 255, 255, 255);
    mapBuffer.colorMode(RGB, 255, 255, 255, 255)
}

function draw(){
    // MOVEMENT
    //ANGLES
    if(rotating) lookAngle = (lookAngle+.5)%360;
    if(keyIsDown(RIGHT_ARROW)) lookAngle += 1;
    if(keyIsDown(LEFT_ARROW)) lookAngle -= 1;
    ray.setViewDir(cos(radians(lookAngle)), sin(radians(lookAngle)));

    //DIRECTIONAL MOVEMENT
    if(keyIsDown("W".charCodeAt(0)) || keyIsDown(UP_ARROW)) ray.velShift(ray.viewDir.x, ray.viewDir.y);
    if(keyIsDown("S".charCodeAt(0)) || keyIsDown(DOWN_ARROW)) ray.velShift(-ray.viewDir.x, -ray.viewDir.y);

    if(keyIsDown("A".charCodeAt(0))) ray.velShift(cos(radians(lookAngle-90)), sin(radians(lookAngle-90)));
    if(keyIsDown("D".charCodeAt(0))) ray.velShift(cos(radians(lookAngle+90)), sin(radians(lookAngle+90)));

    ray.move();
    ray.vel(0, 0);

    //MATH TO DO BEFORE IMAGES CAN BE DRAWN
    vertices = [];
    calcVertices(vertices);
    background(0);

    //DETERMINE WHETHER TO DRAW FULL 3D WORLD WITH MINIMAP OR JUST GRID
    if(!showWalls){
        drawMap(mapBuffer);
        image(mapBuffer, 0, 0);
    } else{
        tDBuffer.background(0);
        tDBuffer.fill(128,0,0);
        tDBuffer.rectMode(CORNER);
        tDBuffer.rect(0, height/2, width, height/2);
        drawWalls3D(tDBuffer, vertices);
        drawMap(mapBuffer);
        mapBuffer.copy(floor(ray.pos.x-100), floor(ray.pos.y-100), 200, 200, 0, 0, 200, 200);
        image(tDBuffer, 0, 0);
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


