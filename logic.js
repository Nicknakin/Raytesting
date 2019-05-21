let walls = [];
let ray;

function setup(){
    let canvas = createCanvas(800,800);
    for(let i = 0; i < 10; i++){
        walls.push(new Boundary(random(800), random(800), random(800), random(800)));
        walls.push(new Boundary(0,0,0,800));
        walls.push(new Boundary(0,800,800,800));
        walls.push(new Boundary(800,800,800,0));
        walls.push(new Boundary(0,0,800,0));
    }
    ray = new Ray(400, 400);
}

function draw(){
    background(0);
    let vertices = [];
    for(let i = 0; i < 360; i+=0.5){
        ray.setAngle(cos(radians(i)), sin(radians(i)));
        let closest = createVector();
        let record = Infinity;
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
            vertices.push(createVector(closest.x, closest.y));
        }
        
    }

    fill(255);

    beginShape();
    for(vert in vertices){
        if(vertices[vert]){
            vertex(vertices[vert].x, vertices[vert].y);
        }
    }
    endShape(CLOSE);

    for(wall in walls){
        walls[wall].show();
    }
    ray.move(mouseX, mouseY);
}
