class Boundary{
    constructor(x1, y1, x2, y2, context){
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
        this.context = context;
    }
    
    show(){
        this.context.stroke(255);
        this.context.line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}
