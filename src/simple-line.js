class  Point{
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    getY() {
        return this.y
    }
    getX() {
        return this.x
    }
    getTimeStamp(){
        return this.timeStamp
    }
    equals(x, y){
        return (x === this.x) && (y === this.y)
    }
    update(x,y) {
        this.x = x
        this.y = y
    }
    copy() {
        return new Point(this.x, this.y);
    }
}

/**
 * Computes the x and y coordinates of the bezier curve with 3 points given a t in [0,1]
 * @param {double} t - must be between 0 and 1
 * @param {Point} p1 - point one 
 * @param {Point} p2 - point two
 * @param {Point} p3 - point three
 * @returns The point with x and y coordinates given t
 */
const bezierCurve3Points = function(t, p1, p2, p3) {
    const x = (1-t)**2*p1.x + 2*(1-t)*t*p2.x + t**2*p3.x;
    const y = (1-t)**2*p1.y + 2*(1-t)*t*p2.y + t**2*p3.y;
    return { x, y };
}

class Line {
    constructor(radius, whiteboard){
        // constants
        this.numberPointsInMemory = 2
        this.step = 10
        this.bezierStep = 800;
        this.maxBezierParamValue = (0.6)*this.bezierStep;
        this.whiteboard = whiteboard

        // variables
        this.color = undefined;
        this.isPressed = false;
        this.RADIUS = radius;
        this.currentRadius = radius;
        this.previousRadius = radius;
        this.currentPosition = new Point(undefined, undefined);
        this.lastNPoints = []
        this.dx = 0
        this.dy = 0
    }

    setColor(fillStyle) {
        this.color = fillStyle;
        this.whiteboard.fillStyle = fillStyle;
        console.log("color set", this.whiteboard.fillStyle);
    }

    reloadColor() {
        this.setColor(this.color);
    }

    setRadius(radius) {
        this.currentRadius = radius;
        this.previousRadius = radius;
        this.RADIUS = radius;
    }

    updateCurrentPos(x, y) {
        this.currentPosition.update(x,y)
        this.lastNPoints.push(new Point(x,y));
        if (this.lastNPoints.length > 3) this.lastNPoints.shift()
    }

    /**
     * Fills the line with circles between 3 previous points under a bezier curve path.
     */
    drawLine() {
        console.log("using color", this.whiteboard.fillStyle);
        if (this.lastNPoints.length == 3) this.drawBezierCurve();
    }

    drawBezierCurve(){
        let radiusDifference = this.currentRadius - this.previousRadius;
        let radiusProportionalToBezierParam = (currentBezierParamVal, maxBezierParamVal) => {
            /*
                  X       -----------  radiusDifference
            currentBezier ------------   maxBezier
            */
            return ( Math.abs(radiusDifference) * currentBezierParamVal ) / maxBezierParamVal ;
        };
        for (let i = 0 ; i <= this.maxBezierParamValue ; i++) {
            let {x,y} = bezierCurve3Points(i/this.bezierStep, this.lastNPoints[0], this.lastNPoints[1], this.lastNPoints[2]);
            if (i == this.maxBezierParamValue) {
              // next time we call drawBezierCurve, the point where the bezier curve stopped will be the starting point
              // for the next bezier curve
              this.lastNPoints[1].update(x,y);
             
            }
            let radius = radiusDifference < 0 ? 
                        -radiusProportionalToBezierParam(i, this.maxBezierParamValue) 
                        : radiusProportionalToBezierParam(i, this.maxBezierParamValue);

            this.drawPoint(x, y, this.previousRadius + radius)
          }
    }

    /**
     * Draw a single point filled circle
     */
    drawPoint(x, y, radius) {
        this.whiteboard.beginPath()
        this.whiteboard.arc(x, y, radius, 0 , Math.PI*2 , false)
        this.whiteboard.fill()
    }

    pressPen(){
        this.isPressed = true;
    }

    /**
     * States that the pen (mouse) was released from the paper.
     * This avoids drawing bezier curves between non-continuous points across the canvas.
     */
    releasePen() {
        this.isPressed = false;
        this.lastNPoints = [];
    }

    update(mouse) {
        this.previousRadius = this.currentRadius;
        this.currentRadius = this.RADIUS / (1 +  mouse.getVelocity()*2); 
    }

}


export { Line }
