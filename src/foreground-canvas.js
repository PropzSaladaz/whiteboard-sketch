import { UI } from '/src/ui.js'
import { Line } from '/src/simple-line.js'


// ----------------- (Fore/Back)ground Canvas ------------------ //






/**
 * Represents the canvas with all drawings
 * @attribute canvas - The canvas object itself
 * @attribute context - The canvas' 2d context
 * @attribute line - a Line object that draws in the canvas
 * @attribute largest(X/Y)ValueDrawn - name is self explanatory
 */
class Canvas{
    constructor(canvas,line=undefined){
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.context.imageSmoothingQuality='high'
        this.line = line
        this.largestXValueDrawn = 0
        this.largestYValueDrawn = 0
        this.backgroundColor = undefined
    }

    
    /**
     * Draws a line to the mouse's current position
     * @param {mouse} mouse - contains the current position of the mouse 
     */
    drawLine(mouse) {
        this.line.updateCurrentPos(mouse.currentX, mouse.currentY)
        this.line.updateLastPos(mouse.lastX, mouse.lastY)
        this.line.drawLine()
    }

    /**
     * Deletes all drawings, and resets the canvas size
     */
    clearScreen(){
        console.log(this.context.fillStyle);
        if (this.line) this.context.clearRect(0,0,window.innerWidth, window.innerHeight)
        this.largestXValueDrawn = 0;
        this.largestYValueDrawn = 0;
        this.setCanvasWidth()
        if (this.backgroundColor) {
            console.log(this.context.fillStyle);
            this.context.fillStyle = this.backgroundColor
            this.context.fillRect(0, 0, window.innerWidth, window.innerHeight)
        }
    }

    /**
     * Resizes the canvas.
     * If the user resizes to a point where drawings get off screen
     * the canvas is not resized to preserve the drawing integrity
     */
    resize(){
        if (innerWidth > this.largestXValueDrawn && 
            innerHeight > this.largestYValueDrawn &&
            innerWidth != this.canvas.width && 
            innerHeight != this.canvas.height) {
            // copy canvas state to a temporary one
            var tempCanvas = document.createElement('canvas')
            tempCanvas.width = window.innerWidth
            tempCanvas.height = window.innerHeight
            var tempCtx = tempCanvas.getContext('2d')
            tempCtx.drawImage(this.canvas, 0, 0)

            // copy back to the original
            this.setCanvasWidth()
            this.context.drawImage(tempCanvas, 0, 0)
        }
    }

    /**
     * Updates the limit X and Y positions of the entire drawing
     * to avoid unwanted canvas resizings that might delete lines
     * from the drawing
     * @param {mouse} mouse - contains the mouse's current position 
     */
    updateCanvasLimits(mouse){
        if (mouse.currentX > this.largestXValueDrawn) 
            this.largestXValueDrawn = mouse.currentX
        if (mouse.currentY > this.largestYValueDrawn) 
            this.largestYValueDrawn = mouse.currentY
    }

    setCanvasWidth(){
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    changeBackgroundColor(color) {
        this.backgroundColor = color
        this.context.fillStyle = color
        this.context.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }

    
}


const frontCanvas = document.querySelector('.foreground-canvas')
frontCanvas.width = innerWidth
frontCanvas.height = innerHeight

const foregroundCanvas = new Canvas(
    frontCanvas,
    new Line(2, frontCanvas.getContext('2d'))
    ) 

/* const backCanvas = document.querySelector('.background-canvas')
backCanvas.width = innerWidth
backCanvas.height = innerHeight*/

const backgroundCanvas = 0 //new Canvas(backCanvas)

 
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
/*     foregroundCanvas.resize()
    backgroundCanvas.resize() */
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


/* backgroundCanvas.changeBackgroundColor('rgb(200,200,200)') */
function animate() {
    requestAnimationFrame(animate)
    if(mousePressed) {
        foregroundCanvas.drawLine(mouse)
        foregroundCanvas.updateCanvasLimits(mouse)
/*         backgroundCanvas.updateCanvasLimits(mouse) */
        foregroundCanvas.resize()
/*         backgroundCanvas.resize() */
    }
}
animate()



export { foregroundCanvas, backgroundCanvas }