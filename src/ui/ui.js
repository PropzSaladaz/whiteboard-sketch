import { foregroundCanvas , backgroundCanvas } from '/src/foreground-canvas.js';
import themes from '/src/ui/theme.js';
import ColorPallet from './menu/color-pallet.js';
import {eventString, eventObj} from  '/src/dom/events.js';
import { 
    FOREGROUND_CANVAS_DOM,
    SLIDER_LINE_WIDTH_DOM, 
    WRAPPER_COLOR_PALLET_DOM, 
    MENU_DOM, 
    BUTTON_ERASER_DOM,
    BUTTON_SAVE_IMG_DOM
} from '../dom/domElements.js';


const minLineRadius   = 5;
const minEraserRadius = 2;

class UserInterface {
    constructor(canvas) {
        this.canvas              = canvas
        this.theme               = themes.light
        this.menuWrapper         = MENU_DOM;
        this.collorPalletWrapper = WRAPPER_COLOR_PALLET_DOM
        this.isVisible           = true;
        this.isInsideMenu        = false
        this.usingEraser         = false;
        this.lineWidth           = minLineRadius
        this.currentColor        = themes.light.mainLineColor
        this.colorPallet         = new ColorPallet(this.theme.mainLineColor);
        
    }
    getThemeBackgroundColor() {
        return this.theme.backgroundColor;
    }

    getCanvas(){
        return this.canvas;
    }

    setCurrentColor(color) { 
        this.currentColor = color;
    }

    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth
    }

    getLineColor() {
        return this.colorPallet.getSelectedColor();
    }

    getLineWidth() {
        return this.lineWidth
    }

    getColorPalletDOM() {
        return this.colorPallet.getDomElement();
    }

    useEraser() {
        this.setCurrentColor(this.theme.eraserColor);
        this.usingEraser = true;
        this.colorPallet.clearSelectedColor();
        foregroundCanvas.setLineColor(this.currentColor);
    }

    stopUsingEraser() {
        this.usingEraser = false;
        SLIDER_LINE_WIDTH_DOM.dispatchEvent(eventObj.onReset); // send reset event to SLIDER_LINE_WIDTH_DOM to reset line width
        this.setLineWidth(minLineRadius);
        foregroundCanvas.setLineWidth(minLineRadius);
    }

    toggleTheme(){
        const isUsingMainColor = (this.currentColor === this.theme.mainLineColor);
        const mainColorButton = this.colorPallet.getColorDiv('mainColor') // select the color of the first button (the main color one)
        this.stopUsingEraser();
        this.theme = (this.theme.name === themes.light.name) ? themes.dark : themes.light;

        document.querySelector('body').style.backgroundColor = this.theme.backgroundColor;
        mainColorButton.style.backgroundColor = this.theme.mainLineColor; 
        mainColorButton.dispatchEvent(new Event('click')); // simulate a click to select main color
        if (isUsingMainColor) {
            this.setCurrentColor(this.theme.mainLineColor);
            foregroundCanvas.setLineColor(this.currentColor);
        }
        this.colorPallet.mainColor = this.theme.mainLineColor;
    }

    eventLineWidthChanged() {
        //this.dom.dispatchEvent(lineWidthChange)
    }


    setThemeColor() {
        this.setCurrentColor(this.colorPallet.getSelectedColor());
        foregroundCanvas.setLineColor(this.currentColor);
    }


    clearScreen() {
        foregroundCanvas.clearScreen();
    }

    hide() {
        //this.isInsideMenu = false;
        this.menuWrapper.style.transform = 'translateX(100px)';
        this.menuWrapper.style.opacity   = '0';
        this.collorPalletWrapper.style.transform = 'translateX(100px)';
        this.collorPalletWrapper.style.opacity = '0';
    }

    show() {
        //this.isInsideMenu = true;
        this.menuWrapper.style.transform = 'translateX(0px)';
        this.menuWrapper.style.opacity   = '1';
        this.collorPalletWrapper.style.transform = 'translateX(0px)';
        this.collorPalletWrapper.style.opacity = '1';
    }

    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
            this.isVisible = false;
        }
        else {
            this.show();
            this.isVisible = true;
        }
    }
}


const UI = new UserInterface()

// ------------------------ Events -------------------------------- //

SLIDER_LINE_WIDTH_DOM.addEventListener('change', onChangeLineWidth);
SLIDER_LINE_WIDTH_DOM.addEventListener('reset', onResetLineWidth);

document.querySelector('.clear-screen').addEventListener('mousedown', onClearScreen)
document.querySelector('.theme').addEventListener('click', onChangeTheme);
document.querySelector('.main-menu').addEventListener('mousedown', onMouseDownInsideMenu)
document.querySelector('.main-menu').addEventListener('mouseover', onMouseOverMenu)
document.querySelector('.main-menu').addEventListener('mouseleave', onMouseLeaveMenu)
document.querySelector('.ui-wrapper').addEventListener('mouseover', showUIMenu);
document.querySelector('.ui-wrapper').addEventListener('mouseout',  hideUIMenu);
document.querySelector('.color-pallet').addEventListener('mousedown', onMouseDownInsideMenu)

window.addEventListener('mouseup', onMouseUp)

SLIDER_LINE_WIDTH_DOM.addEventListener('input', changeInputRangeFillBackground)

BUTTON_ERASER_DOM.addEventListener('click', onEraser);
BUTTON_SAVE_IMG_DOM.addEventListener('click', onSaveImg);

MENU_DOM.addEventListener(eventString.onColorSelected, onColorSelected);

// ------------------------ Event Handlers ----------------------- //

function hideUIMenu() {
    UI.hide();
}

function showUIMenu() {
    UI.show();
}

function onResetLineWidth() {
    SLIDER_LINE_WIDTH_DOM.value = (SLIDER_LINE_WIDTH_DOM.max - SLIDER_LINE_WIDTH_DOM.min) / 2;     // set width to half
    FOREGROUND_CANVAS_DOM.dispatchEvent(eventObj.onLineWidthChange.setWidth(minLineRadius + (SLIDER_LINE_WIDTH_DOM.value/25)));
    SLIDER_LINE_WIDTH_DOM.dispatchEvent(new Event('input'), { target: SLIDER_LINE_WIDTH_DOM });             // set the slider background to half
}

function onChangeLineWidth(){
    if (UI.usingEraser) foregroundCanvas.setLineWidth(SLIDER_LINE_WIDTH_DOM.value);
    else foregroundCanvas.setLineWidth(SLIDER_LINE_WIDTH_DOM.value)
}

function onClearScreen(){
    UI.clearScreen()
}

function onChangeTheme(){
    UI.toggleTheme();
    UI.clearScreen();
    FOREGROUND_CANVAS_DOM.dispatchEvent(eventObj.onToggleTheme.setColor(UI.getThemeBackgroundColor()));
}

function onMouseDownInsideMenu(){
    UI.isInsideMenu = true
}

function onMouseUp(){
    UI.isInsideMenu = false
}

function changeInputRangeFillBackground(e) {
    let target = e.target
    if (e.target.type !== 'range') {
        target = document.getElementById('range')
    }
    const min = target.min
    const max = target.max
    const val = target.value

    target.style.backgroundSize = ` 100% ${100 - (val - min) * 100 / (max - min)}%` 
}

function onHideMenu(){
    UI.toggleVisibility();
}

function onEraser(){
    UI.useEraser();
}

function onSaveImg() {
    FOREGROUND_CANVAS_DOM.dispatchEvent(eventObj.onSaveCanvasAsImg);
}

function onColorSelected(e) {
    UI.stopUsingEraser();
}

function onMouseOverMenu(e) {
    UI.isInsideMenu = true;
}

function onMouseLeaveMenu(e) {
    UI.isInsideMenu = false;
}

export { UI }