const canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight

var c = canvas.getContext('2d')
var mousePressed = false;
var point = new Circle(0,0,0,0,2)



window.addEventListener('mousedown', (event) => {
    mousePressed = true;
})

window.addEventListener('mouseup', (event) => {
    c.stroke()
    mousePressed = false;
})

window.addEventListener('mousemove', (event) => {
    mouse.update(event.x, event.y)

})


var button = document.querySelector('button').addEventListener('mousedown', () => {
    console.log('clicked');
    c.clearRect(0,0,window.innerWidth, window.innerHeight)
})




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
        console.log(c.strokeStyle);
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0 , Math.PI*2 , false)
        c.stroke()
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

    this.updatePos= (x, y) => {
        this.x = x
        this.y = y
    }

    this.continuousDrawing = (x, y, prevX, prevY) => {
        c.strokeStyle = `rgb(${100*mouse.getVelocity()},${5*mouse.getVelocity()},${5*mouse.getVelocity()})`
        const step = 100
        const xStep = (x-prevX)/step
        const yStep = (y-prevY)/step
        var xPos = prevX
        var yPos = prevY
        for ( let i = 0 ; i < step ; i++ ){
            point.updatePos(xPos, yPos)
            point.draw()
            xPos += xStep
            yPos += yStep
        }

    }
}

function animate() {
    requestAnimationFrame(animate)
    if(mousePressed) {
        point.draw()
        point.updatePos(mouse.currentX, mouse.currentY)
        point.continuousDrawing(mouse.currentX, mouse.currentY, mouse.lastX, mouse.lastY)
    }
}
animate()