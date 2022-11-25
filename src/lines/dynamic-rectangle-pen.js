import {BaseLine} from './base-line.js'
class DynamicRectanglePen extends BaseLine{
    constructor(radius, whiteboard) {
        super(radius, whiteboard)
    }

    update(mouse) {
        this.previousRadius = this.currentRadius;
        this.currentRadius = this.RADIUS / (1 +  mouse.getVelocity()*2); 
    }

    drawShape(x, y, radius) {
        this.whiteboard.rect(x, y, 3*radius , 0.3*radius);
    }

    radiusProportionalToBezierParam(currentBezierParamVal, maxBezierParamVal, radiusDifference) {
        /*
        X             ------------   radiusDifference
        currentBezier ------------   maxBezier
        */
        return ( Math.abs(radiusDifference) * currentBezierParamVal ) / maxBezierParamVal ;
            
    };
}

export { DynamicRectanglePen }
