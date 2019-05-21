class Ray{
    constructor(x, y){
        this.pos = createVector(x,y);
        this.dir = createVector(1,0);
    }

    show(){
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x*20, this.dir.y*20);
        pop();
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

    move(x, y){
        this.pos.x = x;
        this.pos.y = y;
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

        if(t > 0 && t < 1 && u > 0){
            return createVector(x1+t*(x2-x1), y1+t*(y2-y1));
        }
    }
}
