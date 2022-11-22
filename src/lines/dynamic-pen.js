import {BaseLine} from './base-line.js'
class DynamicPen extends BaseLine{
    constructor(radius, whiteboard) {
        super(radius, whiteboard)
    }

    update(mouse) {
        this.previousRadius = this.currentRadius;
        this.currentRadius = this.RADIUS / (1 +  mouse.getVelocity()*2); 
    }

    drawShape(x, y, radius) {
        this.whiteboard.arc(x, y, radius, 0 , Math.PI*2 , false);
    }

    radiusProportionalToBezierParam(currentBezierParamVal, maxBezierParamVal, radiusDifference) {
        /*
        X             ------------   radiusDifference
        currentBezier ------------   maxBezier
        */
        return ( Math.abs(radiusDifference) * currentBezierParamVal ) / maxBezierParamVal ;
            
    };
}

export { DynamicPen }
