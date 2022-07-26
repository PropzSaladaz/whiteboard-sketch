class Line {
    constructor(radius, whiteboard){
        // constants
        this.numberPointsInMemory = 2
        this.step = 800
        this.whiteboard = whiteboard

        // variables
        this.radius = radius
        this.currentPosition = new Point(undefined, undefined)
        this.lastPosition = new Point(undefined, undefined);
        this.lastNPoints = []
        this.dx = 0
        this.dy = 0
    }

    setColor(fillStyle) {
        this.whiteboard.fillStyle = fillStyle
    }

    setRadius(radius) {
        this.radius = radius
    }

    updateCurrentPos(x, y) {
        this.currentPosition.update(x,y)
    }

    updateLastPos(x, y) {
        this.lastPosition.update(x,y)
    }

    drawLine(prevX, prevY) {
        /**
         * Fills the line with circles between the 2 last recorded points
         * by the mousemove event handler
         */

        const xStep = (this.currentPosition.getX()-this.lastPosition.getX())/this.step
        const yStep = (this.currentPosition.getY()-this.lastPosition.getY())/this.step
        var xPos = this.lastPosition.getX()
        var yPos = this.lastPosition.getY()
        for ( let i = 0 ; i < this.step ; i++ ){
            this.drawPoint(xPos, yPos)
            xPos += xStep
            yPos += yStep
        }

    }

    drawPoint(x, y) {
        /**
         * Draw a single point filled circle
         */
        this.whiteboard.beginPath()
        this.whiteboard.arc(x, y, this.radius, 0 , Math.PI*2 , false)
        this.whiteboard.fill()

    }
}

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
}

export { Line }
