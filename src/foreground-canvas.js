import { UI } from '/src/ui/ui.js'
import { DynamicPen } from '/src/lines/dynamic-pen.js'
import { DynamicRectanglePen } from '/src/lines/dynamic-rectangle-pen.js'
import { StaticPen } from '/src/lines/static-pen.js'
import { Canvas } from '/src/dom/canvas.js'
import {FOREGROUND_CANVAS_DOM} from '/src/dom/domElements.js';
import {eventString} from '/src/dom/events.js';


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
            (this.currentTime-this.lastTime ? this.currentTime-this.lastTime : 1) // avoid 0 so velocity isnt infinity
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
    new DynamicRectanglePen(UI.lineWidth, frontCanvas.getContext('2d'))
); 






class DrawingApp {
    constructor(canvas, ui, mouse){
        this.canvas = canvas;
        this.ui = ui;
        this.mouse = mouse;
    }

    update() {
        if (mousePressed) {
            this.canvas.update(this.mouse);
        }

    }
}

const drawingApp = new DrawingApp(foregroundCanvas, UI, mouse);

const backgroundCanvas = 0 //new Canvas(backCanvas)

 
// --------------------Event Listeners -------------------- //

window.addEventListener('mousedown', onMouseDown)
window.addEventListener('mouseup',   onMouseUp)
window.addEventListener('mousemove', onMouseMove)
window.addEventListener('resize',    onResize)
window.addEventListener('keydown', onKeyDown);
FOREGROUND_CANVAS_DOM.addEventListener(eventString.onColorSelected, onColorSelected);
FOREGROUND_CANVAS_DOM.addEventListener(eventString.onSaveCanvasAsImg, onSaveCanvasAsImg);
FOREGROUND_CANVAS_DOM.addEventListener(eventString.onLineWidthChange , onLineWidthChange);
FOREGROUND_CANVAS_DOM.addEventListener(eventString.onToggleTheme , onToggleTheme);



function onMouseDown(e) {
    if (!UI.isInsideMenu) {
        mousePressed = true;
        foregroundCanvas.startNewLine();
    }
}

function onMouseUp(e) {
    if(!UI.isInsideMenu){
        mousePressed = false;
        foregroundCanvas.endOfLine();
    }
}

function onMouseMove(e) {
    mouse.update(e.x, e.y)
}

function onResize(e) {
    foregroundCanvas.resize()
}

function onKeyDown(e) {
    if (e.ctrlKey && e.key === 'z') {
        foregroundCanvas.undo();
    }
    else if (e.ctrlKey && e.key === 'y' ){
        foregroundCanvas.redo();
    }
}

function onColorSelected(e) {
    foregroundCanvas.setLineColor(e.color);
}

function onSaveCanvasAsImg() {
    foregroundCanvas.saveCanvasAsImg();
}

function onLineWidthChange(e) {
    foregroundCanvas.setLineWidth(e.width);
}

function onToggleTheme(e) {
    foregroundCanvas.setBackgroundColor(e.color);
}


function animate() {
    requestAnimationFrame(animate)
    drawingApp.update()
}
animate()



export { foregroundCanvas, backgroundCanvas }