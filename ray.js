class Ray{
    constructor(x, y){
        this.pos = createVector(x,y);
        this.dir = createVector(1,0);
        this.viewDir = createVector(1,0);
        this.v = createVector(0,0);
    }

    vel(x, y){
        this.v.x = x;
        this.v.y = y;
        this.v.normalize();
    }

    velShift(x, y){
        let temp = createVector(x, y);
        this.v.add(temp);
        this.v.normalize();
    }

    show(){
        fill(255);
        stroke(0);
        ellipse(this.pos.x, this.pos.y, 5, 5);
    }

    setDir(x, y){
        this.dir.x = x-this.pos.x;
        this.dir.y = y-this.pos.y;
        this.dir.normalize();
    }
    
    setAngle(x, y){
        this.dir.x = x;
        this.dir.y = y;
        this.dir.normalize();
    }

    setViewDir(x, y){
        this.viewDir.x = x;
        this.viewDir.y = y;
        this.viewDir.normalize();
    }

    getViewDir(){
        return (degrees(atan2(this.viewDir.y, this.viewDir.x))+360)%360;
    }

    move(x, y){
        if(x && y){
            this.pos.x = x;
            this.pos.y = y;
        } else {
            this.pos.x += this.v.x;
            this.pos.y += this.v.y;
        }
    }

    cast(boundary){
        const x1 = boundary.a.x;
        const y1 = boundary.a.y;
        const x2 = boundary.b.x;
        const y2 = boundary.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.dir.x+this.pos.x;
        const y4 = this.dir.y+this.pos.y;

        const denominator = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if(denominator == 0)
            return false;

        const t = (((x1-x3)*(y3-y4))-((y1-y3)*(x3-x4)))/denominator;
        const u = -(((x1-x2)*(y1-y3))-((y1-y2)*(x1-x3)))/denominator;

        if(t >= 0 && t <= 1 && u >= 0){
            return createVector(x1+t*(x2-x1), y1+t*(y2-y1), p5.Vector.dist(createVector(x1+t*(x2-x1), y1+t*(y2-y1)), this.pos));
        }
    }
}
