const MAX_UNDO_SIZE = 60;

class UndoHistory{
    constructor(size, initialObj){
        this.size = size+1;
        this.history = [];
        this.currentPos = 0;
        this.history.push(initialObj);
    }

    add(obj) {
        if (!this.isMostRecentChange()) {
            this.deleteAllChangesAfterCurrent();
        }
        if (this.currentPos < this.size) this.currentPos++;

        this.history.push(obj);
        if (this.history.length > this.size) {
            this.history.shift();
        }
        console.log(this.currentPos);
        console.log(this.history);
    }

    undo() {
        if (this.currentPos > 0){
            this.currentPos--;
        }
        console.log(this.currentPos);
        console.log(this);
        return this.history[this.currentPos];
    }

    redo() {
        if (this.currentPos < this.history.length-1){
            this.currentPos++;
        }
        return this.history[this.currentPos];
        
    }

    clear(initialObj) {
        this.history = [];
        this.currentPos = 0;
        this.history.push(initialObj);
    }

    isMostRecentChange() {
        return this.currentPos === this.history.length-1;
    }

    deleteAllChangesAfterCurrent() {
        let size = this.history.length-1;
        while (size > this.currentPos) {
            this.history.pop();
            size--;
        }
    }

    
}

/**
 * Represents the canvas with all drawings
 * @attribute canvas - The canvas object itself
 * @attribute context - The canvas' 2d context
 * @attribute line - a Line object that draws in the canvas
 * @attribute largest(X/Y)ValueDrawn - name is self explanatory
 */
 class Canvas{
    constructor(canvas,line=undefined){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.imageSmoothingQuality = 'high';
        this.line = line;
        this.largestXValueDrawn = 0;
        this.largestYValueDrawn = 0;
        this.backgroundColor = undefined;
        this.undoHistory = new UndoHistory(MAX_UNDO_SIZE, this.canvas);
    }
    
    /**
     * Draws a line to the mouse's current position
     * @param {mouse} mouse - contains the current position of the mouse 
     */
    drawLine(mouse) {
        this.line.updateCurrentPos(mouse.currentX, mouse.currentY)
        this.line.drawLine()
    }

    getCanvasCopy(backgroundColor = undefined){
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = window.innerWidth;
        tempCanvas.height = window.innerHeight;
        if(backgroundColor) {
            tempCtx.fillStyle = this.backgroundColor;
            tempCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
        tempCtx.drawImage(this.canvas, 0, 0);
        return tempCanvas;
    }

    endOfLine() {
        this.line.releasePen();
        this.undoHistory.add(this.getCanvasCopy());
        console.log(this.undoHistory);
    }

    undo(){
        this.replaceImageWith(this.undoHistory.undo());
    }

    redo(){
        this.replaceImageWith(this.undoHistory.redo());
    }

    replaceImageWith(newCanvas){
        this.clearScreen();
        this.context.drawImage(newCanvas, 0, 0);
    }

    startNewLine() {
        this.line.pressPen();
    }

    /**
     * Deletes all drawings, and resets the canvas size
     */
    clearScreen(){
        if (this.line) this.context.clearRect(0,0,window.innerWidth, window.innerHeight)
        this.largestXValueDrawn = 0;
        this.largestYValueDrawn = 0;
        this.setCanvasWidth();
    }

    resetCanvasUndoHistory() {
        this.undoHistory.clear(this.canvas);
    }

    /**
     * Resizes the canvas.
     * If the user resizes to a point where drawings get off screen
     * the canvas is not resized to preserve the drawing integrity
     */
    resize(){
        if ((innerWidth > this.largestXValueDrawn || innerHeight > this.largestYValueDrawn) &&
            (innerWidth != this.canvas.width ||innerHeight != this.canvas.height)) {
            // copy canvas state to a temporary one
            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = window.innerWidth
            tempCanvas.height = window.innerHeight
            let tempCtx = tempCanvas.getContext('2d')
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
        this.line.reloadColor();
    }

    saveCanvasAsImg() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const link = document.createElement('a');

        tempCanvas.width = window.innerWidth
        tempCanvas.height = window.innerHeight        
        tempCtx.fillStyle = this.backgroundColor;
        tempCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        tempCtx.drawImage(this.canvas, 0, 0);

        link.download = 'drawing.png';
        link.href = tempCanvas.toDataURL();
        link.click();
        link.delete;
        tempCanvas.delete;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color
    }

    setLineColor(color) {
        this.line.setColor(color);
    }

    setLineWidth(width) {
        this.line.setRadius(width);
    }

    update(mouse) {
        this.drawLine(mouse);
        this.updateCanvasLimits(mouse);
        this.resize();
        this.line.update(mouse);
    }
}


export { Canvas }