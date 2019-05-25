let walls = [];
let letFill = true;
let ray;
let viewDistance = Infinity;
let showWalls = false;
let numRays = 950;
let i = 0;
let speed = 5;
let gridDimensions = [19, 9, 100];
let lookAngle = 0;
let fov = 110;
let rotating = true;
let vertices;

function setup(){
    let canvas = createCanvas(1900,900);
    createGrid(gridDimensions);
    randomize(); 
    ray = new Ray(width/2, height/2);
    colorMode(RGB, 255, 255, 255, 255)
}

function createGrid(dims){
    for(let i = 0; i < dims[0]*dims[2]; i += dims[2]){
        for(let k = 0; k < dims[1]*dims[2]; k += dims[2]){
            walls.push(new Boundary(i, k+dims[2], i+dims[2], k+dims[2]));
            walls.push(new Boundary(i+dims[2], k+dims[2], i+dims[2], k));
        }
    }
    walls.push(new Boundary(0,0,0,height));
    walls.push(new Boundary(0,height,width,width));
    walls.push(new Boundary(width,height,width,0));
    walls.push(new Boundary(0,0,width,0));
}

function randomize(){
    for(let i = 0; i < walls.length/4; i++){
        let k = random(walls.length);
         walls.splice(k, 1);  
    }
}

function draw(){
    if(rotating) lookAngle = (lookAngle+.5)%360;
    ray.setViewDir(cos(radians(lookAngle)), sin(radians(lookAngle)));
    vertices = [];
    calcVertices(vertices);
    background(0);

    if(!showWalls){
        walls.forEach((wall) => wall.show());
        if(letFill) fillView(vertices);
        else drawRays(vertices);
        ray.show();
    } else{
        renderWalls(vertices);
    }
}

function drawRays(vertices){
    fill(128);
    stroke(128);
    vertices.forEach(vertex => line(ray.pos.x, ray.pos.y, vertex.x, vertex.y));
}

function renderWalls(vertices){
    rectMode(CENTER);
    for(viewPoint in vertices){
        let p = vertices[viewPoint];
        noFill();
        stroke(255/p.z*50);
        rect(viewPoint*width/vertices.length, height/2, viewPoint/width, height*20/p.z);
    }       
}

function calcVertices(){
    for(let i = ray.getViewDir()-fov/2; i < ray.getViewDir()+fov/2; i+=60/numRays){
        ray.setAngle(cos(radians(i)), sin(radians(i)));
        let closest = createVector(ray.pos.x+ray.dir.x*viewDistance, ray.pos.y+ray.dir.y*viewDistance);
        let record = viewDistance;
        for(wall in walls){
            if(p5.Vector.dist(ray.pos, walls[wall].a) < viewDistance || p5.Vector.dist(ray.pos, walls[wall].b) < viewDistance){
                let pt = ray.cast(walls[wall]);
                if(pt){
                    let dist = p5.Vector.dist(pt, ray.pos);
                    if(dist < record){
                        record = dist;
                        closest = pt;
                    }
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

function fillView(vertices){
    vertices.push(ray.pos);
    fill(128);
    stroke(128);
    beginShape();
    for(vert in vertices){
        if(vertices[vert]){
            vertex(vertices[vert].x, vertices[vert].y);
        }
    }

    endShape(CLOSE);
}
