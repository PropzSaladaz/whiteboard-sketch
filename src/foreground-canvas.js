import { UI } from '/src/ui.js'
import { Line } from '/src/simple-line.js'

const foreGroundCanvas = document.querySelector('.foreground-canvas')
foreGroundCanvas.width = innerWidth
foreGroundCanvas.height = innerHeight

const c = foreGroundCanvas.getContext('2d')
const simpleLine = new Line(2, c)

var mousePressed = false;


// Event Listeners ----------------------------------------

window.addEventListener('mousedown', (event) => {
    if (!UI.isInsideMenu) mousePressed = true;
})

window.addEventListener('mouseup', (event) => {
    mousePressed = false;
})

window.addEventListener('mousemove', (event) => {
    mouse.update(event.x, event.y)

})

document.querySelector('.clear-screen-btn').addEventListener('mousedown', () => {
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



function animate() {
    requestAnimationFrame(animate)
    if(mousePressed) {
        simpleLine.updateCurrentPos(mouse.currentX, mouse.currentY)
        simpleLine.updateLastPos(mouse.lastX, mouse.lastY)
        simpleLine.drawLine()
    }
}
animate()



export { simpleLine }