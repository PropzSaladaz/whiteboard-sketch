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

export {Point}