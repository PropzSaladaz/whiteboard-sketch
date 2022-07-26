import { UI } from '/src/ui.js'
import { Line } from '/src/simple-line.js'


// ----------------- (Fore/Back)ground Canvas ------------------ //


const frontCanvas = document.querySelector('.foreground-canvas')
frontCanvas.width = innerWidth
frontCanvas.height = innerHeight
const line = new Line(2, frontCanvas.getContext('2d'))

const foregroundCanvas = {
    canvas: frontCanvas,
    context: frontCanvas.getContext('2d'),
    line: line,
    largestXValueDrawn: 0,
    largestYValueDrawn: 0,
    
    drawLine(mouse) {
        this.line.updateCurrentPos(mouse.currentX, mouse.currentY)
        this.line.updateLastPos(mouse.lastX, mouse.lastY)
        this.line.drawLine()
    },

    clearScreen(){
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight)
        this.largestXValueDrawn = 0;
        this.largestYValueDrawn = 0;
        this.setCanvasWidth()
    },

    resize(){
        console.log(this.largestXValueDrawn);
        if (innerWidth >= this.largestXValueDrawn && 
            innerHeight >= this.largestYValueDrawn) {
            // copy canvas state to a temporary one
            var tempCanvas = document.createElement('canvas')
            tempCanvas.width = innerWidth
            tempCanvas.height = innerHeight
            var tempCtx = tempCanvas.getContext('2d')
            tempCtx.drawImage(this.canvas, 0, 0)

            // copy back to the original
            this.setCanvasWidth()
            this.context.drawImage(tempCanvas, 0, 0)
        }
    },

    updateCanvasLimits(mouse){
        if (mouse.currentX > this.largestXValueDrawn) 
            this.largestXValueDrawn = mouse.currentX
        if (mouse.currentY > this.largestYValueDrawn) 
            this.largestYValueDrawn = mouse.currentY
    },

    setCanvasWidth(){
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight
    }

    
}

const backCanvas = document.querySelector('.background-canvas')
backCanvas.width = innerWidth
backCanvas.height = innerHeight

const backgroundCanvas = {
    canvas: backCanvas,
    context: backCanvas.getContext('2d'),
    
    changeColor: function(color) {
        this.context.fillStyle = color
        this.context.fillRect(0, 0, window.innerWidth, window.innerHeight)
    },

    resize(){
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight
    }
}


// --------------------Event Listeners -------------------- //

var mousePressed = false;

window.addEventListener('mousedown', () => {
    if (!UI.isInsideMenu) mousePressed = true;
})

window.addEventListener('mouseup', () => {
    mousePressed = false;
})

window.addEventListener('mousemove', (event) => {
    mouse.update(event.x, event.y)

})

window.addEventListener('resize', () => {
    foregroundCanvas.resize()
    backgroundCanvas.resize()
})

// ------------------ Mouse ----------------------- //

const mouse = {
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



function animate() {
    requestAnimationFrame(animate)
    if(mousePressed) {
        foregroundCanvas.drawLine(mouse)
        foregroundCanvas.updateCanvasLimits(mouse)
    }
}
animate()



export { foregroundCanvas }