let walls = [];
let ray;
let viewDistance = 250;
let showWalls = false;
let numRays = 1000;

function setup(){
    let canvas = createCanvas(1900,900);
    for(let i = 0; i < 10; i++){
        walls.push(new Boundary(random(width), random(height), random(width), random(height)));
        walls.push(new Boundary(0,0,0,height));
        walls.push(new Boundary(0,height,width,width));
        walls.push(new Boundary(width,height,width,0));
        walls.push(new Boundary(0,0,width,0));
    }
    ray = new Ray(width/2, height/2);
}

function draw(){
    background(0);
    let vertices = [];
    for(let i = 0; i < 360; i+=360/numRays){
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
            //line(closest.x, closest.y, ray.pos.x, ray.pos.y);
            vertices.push(createVector(closest.x, closest.y));
        }
        
    }

    fill(128);
    stroke(255,128,0);

    beginShape();
    for(vert in vertices){
        if(vertices[vert]){
            vertex(vertices[vert].x, vertices[vert].y);
        }
    }

    endShape(CLOSE);

    if(showWalls){
        for(wall in walls){
            walls[wall].show();
        }
    }
    ray.move(mouseX, mouseY);
}

function mousePressed(){
    showWalls = true;
}

function mouseReleased(){
    showWalls = false;
}
