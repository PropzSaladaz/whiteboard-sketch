import {Point} from './point.js'

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

class BaseLine {
    constructor(radius, whiteboard){
        // constants
        this.numberPointsInMemory = 2
        this.step = 10
        this.bezierStep = 800;
        this.maxBezierParamValue = (0.6)*this.bezierStep;
        this.whiteboard = whiteboard
        this.MIN_RADIUS = 2;
        this.MAX_RADIUS = 8;

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
    }

    reloadColor() {
        this.setColor(this.color);
    }

    /**
        @param {radius} radius - Radius as a percentage [0-100]
    */
    setRadius(radius) {
        let newRadius = this.getRadiusOfPercentage(radius);
        this.currentRadius = newRadius;
        this.previousRadius = newRadius;
        this.RADIUS = newRadius;
    }

    /**
        @param {radius} radius - Radius as a percentage [0-100]
    */
    getRadiusOfPercentage(radius){
        if (radius > 100 || radius < 0) throw new RadiusUnitsException();
        return this.MIN_RADIUS + (radius/100)*(this.MAX_RADIUS-this.MIN_RADIUS);
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
        if (this.lastNPoints.length == 3) this.drawBezierCurve();
    }

    drawBezierCurve(){
        let radiusDifference = this.currentRadius - this.previousRadius;
        for (let i = 0 ; i <= this.maxBezierParamValue ; i++) {
            let {x,y} = bezierCurve3Points(i/this.bezierStep, this.lastNPoints[0], this.lastNPoints[1], this.lastNPoints[2]);
            if (i == this.maxBezierParamValue) {
              // next time we call drawBezierCurve, the point where the bezier curve stopped will be the starting point
              // for the next bezier curve
              this.lastNPoints[1].update(x,y);
             
            }
            let radius = radiusDifference < 0 ? 
                        -this.radiusProportionalToBezierParam(i, this.maxBezierParamValue, radiusDifference) 
                        : this.radiusProportionalToBezierParam(i, this.maxBezierParamValue, radiusDifference);
            
            this.drawPoint(x, y, this.previousRadius + radius)
          }
    }

    /**
     * Draw a single point filled circle
     */
    drawPoint(x, y, radius) {
        this.whiteboard.beginPath();
        this.drawShape(x, y, radius);
        this.whiteboard.fill();
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


    // All functions below may need to be overwritten for different type of lines
    update(mouse) {

    }

    drawShape(x, y, radius) {
        this.whiteboard.arc(x, y, radius, 0 , Math.PI*2 , false);
    }

    radiusProportionalToBezierParam(currentBezierParamVal, maxBezierParamVal, radiusDifference) {
        return 0;            
    };

}


function RadiusUnitsException() {
    this.message = "Radius must be in percentage format [0-100]";
    this.name = 'RadiusUnitsException';
  }

export { BaseLine }
