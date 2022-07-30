import { UI } from '/src/ui.js'
import { Line } from '/src/simple-line.js'
import { Canvas } from '/src/canvas.js'


// ----------------- (Fore/Back)ground Canvas ------------------ //


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
     foregroundCanvas.resize()
    /*backgroundCanvas.resize() */
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