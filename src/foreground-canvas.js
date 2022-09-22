import { UI } from '/src/ui.js'
import { Line } from '/src/simple-line.js'
import { Canvas } from '/src/canvas.js'




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

let mousePressed = false;

// ----------------- (Fore/Back)ground Canvas ------------------ //


const frontCanvas = document.querySelector('.foreground-canvas')
frontCanvas.width = innerWidth
frontCanvas.height = innerHeight

const foregroundCanvas = new Canvas(
    frontCanvas,
    new Line(UI.lineWidth, frontCanvas.getContext('2d'))
    ) 


class DrawingApp {
    constructor(canvas, ui, mouse){
        this.canvas = canvas;
        this.ui = ui;
        this.mouse = mouse;
    }

    update() {
        if (mousePressed) {
            this.canvas.drawLine(mouse)
            this.canvas.updateCanvasLimits(mouse)
            this.canvas.resize()
        }

    }
}

const drawingApp = new DrawingApp(foregroundCanvas, UI, mouse);
/* const backCanvas = document.querySelector('.background-canvas')
backCanvas.width = innerWidth
backCanvas.height = innerHeight*/

const backgroundCanvas = 0 //new Canvas(backCanvas)

 
// --------------------Event Listeners -------------------- //



const onMouseDown = function(e) {
    if (!UI.isInsideMenu) {
        mousePressed = true;
        foregroundCanvas.startNewLine();
    }
}

const onMouseUp = function(e) {
    mousePressed = false;
    foregroundCanvas.endOfLine();
}

const onMouseMove = function(e) {
    mouse.update(e.x, e.y)
}

const onResize = function(e) {
    foregroundCanvas.resize()
}

window.addEventListener('mousedown', onMouseDown)

window.addEventListener('mouseup',   onMouseUp)

window.addEventListener('mousemove', onMouseMove)

window.addEventListener('resize',    onResize)






/* backgroundCanvas.changeBackgroundColor('rgb(200,200,200)') */
function animate() {
    requestAnimationFrame(animate)
    drawingApp.update()
}
animate()



export { foregroundCanvas, backgroundCanvas }