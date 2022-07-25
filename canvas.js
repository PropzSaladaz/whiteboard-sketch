export { line }
import {insideUI} from './ui.js'

const foreGroundCanvas = document.querySelector('.foreground-canvas')
foreGroundCanvas.width = innerWidth
foreGroundCanvas.height = innerHeight
const line = new Circle(0,0,0,0,2)
const c = foreGroundCanvas.getContext('2d')

var mousePressed = false;



// Event Listeners ----------------------------------------

window.addEventListener('mousedown', (event) => {
    if (!insideUI) mousePressed = true;
})

window.addEventListener('mouseup', (event) => {
    //c.stroke()
    mousePressed = false;
})

window.addEventListener('mousemove', (event) => {
    mouse.update(event.x, event.y)

})


document.querySelector('.clear-screen-btn').addEventListener('mousedown', () => {
    console.log('clicked');
    c.clearRect(0,0,window.innerWidth, window.innerHeight)
})


// Objects ----------------------------------------

var mouse = {
    currentX:    undefined,
    currentY:    undefined,
    currentTime: undefined,

    lastX:       undefined,
    lastY:       undefined,
    lastTime:    undefined,

    update: function(x, y) {
        mouse.lastX = mouse.currentX
        mouse.lastY = mouse.currentY
        mouse.lastTime = mouse.currentTime
    
        mouse.currentX = x
        mouse.currentY = y
        mouse.currentTime = Date.now()
    },

    getVelocity: function() {
        return (
            Math.sqrt((this.currentX-this.lastX)**2 + (this.currentY-this.lastY)**2)
            /
            (this.currentTime-this.lastTime)
            ) 
    }
}


function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0 , Math.PI*2 , false)
        c.fill()

    }

    this.update = () => {
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    this.setColor = function(fillStyle) {
        c.fillStyle = fillStyle
    }

    this.updatePos= function(x, y) {
        this.x = x
        this.y = y
    }

    this.setRadius = function(radius) {
        this.radius = radius
    }

    this.continuousDrawing = function(x, y, prevX, prevY) {

        //c.fillStyle = `rgb(${15*mouse.getVelocity()},${255 - 15*mouse.getVelocity()},${100 + 15*mouse.getVelocity()})`
        //this.radius = mouse.getVelocity()
        const step = 300
        const xStep = (x-prevX)/step
        const yStep = (y-prevY)/step
        var xPos = prevX
        var yPos = prevY
        for ( let i = 0 ; i < step ; i++ ){
            line.updatePos(xPos, yPos)
            line.draw()
            xPos += xStep
            yPos += yStep
        }

    }
}



function animate() {
    requestAnimationFrame(animate)
    if(mousePressed) {
        line.draw()
        line.updatePos(mouse.currentX, mouse.currentY)
        line.continuousDrawing(mouse.currentX, mouse.currentY, mouse.lastX, mouse.lastY)
    }
}
animate()

