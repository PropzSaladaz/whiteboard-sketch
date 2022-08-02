import { foregroundCanvas , backgroundCanvas } from '/src/foreground-canvas.js'


const borderColor = "#EDEDED"
const lightMode = 'L'
const darkMode  = 'D'

const colors = {
    white:     'rgba(255, 255, 255, 1)' ,
    black:     'rgba(0,   0,   0,   1)' ,
    yellow:    'rgba(255, 242, 129, 1)' ,
    blue:      'rgba(106, 120, 245, 1)' ,
    red:       'rgba(236, 117, 139, 1)' ,
    green:     'rgba(109, 251, 157, 1)' ,

    UIBackgroundLightTheme: 'rgba(255, 255, 255, 0.63)'
}

class Theme {
    constructor(name, mainLineColor, eraserColor, uiBackgroundColor, backgroundColor) {
        this.name = name
        this.mainLineColor = mainLineColor
        this.eraserColor = eraserColor
        this.uiBackgroundColor = uiBackgroundColor
        this.backgroundColor = backgroundColor
    }
}

const themes = {
    light: new Theme(lightMode, colors.black, colors.white, colors.black, colors.UIBackgroundLightTheme ),
    dark:  new Theme(darkMode , colors.white, colors.black, colors.white, colors.black )
}
 
const lineWidthInputSlider = document.querySelector('.line-width')
const rangeInput           = document.querySelector('input[type="range"]')
const colorPallet          = document.querySelector('.color-pallet')
const collorPalletWrapper  = document.querySelector('.color-pallet-wrapper');
const hideMenu             = document.querySelector('.hide-menu');
const menuWrapper          = document.querySelector('.main-menu');
const eraserButton         = document.querySelector('.eraser');

const minLineRadius   = 1;
const minEraserRadius = 2;


class UserInterface {
    constructor() {
        this.theme               = themes.light
        this.menuWrapper         = menuWrapper;
        this.collorPalletWrapper = collorPalletWrapper
        this.isVisible           = true;
        this.isInsideMenu        = false
        this.usingEraser         = false;
        this.lineWidth           = minLineRadius
        this.currentColor        = themes.light.mainLineColor
        this.colorPallet         = {mainColor: this.theme.mainLineColor ,
                                    yellow:    colors.yellow ,
                                    blue:      colors.blue ,
                                    red:       colors.red ,
                                    green:     colors.green }

        Object.entries(this.colorPallet).forEach((entryArray) => {
            var color = entryArray[1]
            // Add the collors to the DOM
            var div = document.createElement('div')
            if (color === this.theme.mainLineColor) {
                styleSelected(div)
            }
            div.style.backgroundColor = color
            div.style.transition = "all 200ms ease-in-out"
            div.classList.add("color-btn", "btn-border", "btn-hoverable")
            colorPallet.appendChild(div)
        
        
            // add event listeners to each to change line color if needed
            div.addEventListener('click', () => {
                foregroundCanvas.line.setColor(div.style.backgroundColor)
                this.setCurrentColor(div.style.backgroundColor)
                this.stopUsingEraser();
        
                var colors = [...colorPallet.children]
                colors.forEach( (color) => { // reset all colors' border
                    color.style.borderColor =  borderColor
                    color.style.borderRadius = "30%"
                    color.style.borderWidth = "2px"
                })
                // put border only on the clicked one
                styleSelected(div)
        
            })

            function styleSelected(selectedDiv) {
                selectedDiv.style.borderWidth = "8px"
                selectedDiv.style.borderColor = "#6A78F5"
                selectedDiv.style.borderRadius = "50%"
            }
        
        })

        
    }

    setCurrentColor(color) { 
        this.currentColor = color
    }

    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth
    }

    getLineColor() {
        return this.currentColor
    }

    getLineWidth() {
        return this.lineWidth
    }

    toggleInsideMenu() {
        this.isInsideMenu = !this.isInsideMenu
    }

    useEraser() {
        this.setCurrentColor(this.theme.eraserColor);
        this.usingEraser = true;
        foregroundCanvas.setLineColor(this.currentColor);
    }

    stopUsingEraser() {
        this.usingEraser = false;
    }

    toggleTheme(){
        const isUsingMainColor = (this.currentColor === this.theme.mainLineColor);
        this.theme = (this.theme.name === lightMode) ? themes.dark : themes.light;
        if (isUsingMainColor) {
            this.setCurrentColor(this.theme.mainLineColor);
            foregroundCanvas.setLineColor(this.currentColor);
        }
        colorPallet.mainColor = this.theme.mainLineColor;

        document.querySelector('body').style.backgroundColor = this.theme.backgroundColor;
        document.querySelector('.color-btn').style.backgroundColor = this.theme.mainLineColor;
    }

    eventLineWidthChanged() {
        //this.dom.dispatchEvent(lineWidthChange)
    }

    clearScreen() {
        foregroundCanvas.clearScreen()
        foregroundCanvas.setLineColor(this.currentColor);
    }

    hide() {
        this.menuWrapper.style.transform = 'translateX(100px)';
        this.menuWrapper.style.opacity   = '0';
        this.collorPalletWrapper.style.transform = 'translateX(100px)';
        this.collorPalletWrapper.style.opacity = '0';
    }

    show() {
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

const lineWidthChange = new Event('lineWidthChange')

lineWidthInputSlider.addEventListener('change', onChangeLineWidth);

document.querySelector('.clear-screen').addEventListener('mousedown', onClearScreen)

document.querySelector('.theme').addEventListener('click', onChangeTheme)

document.querySelector('.main-menu').addEventListener('mousedown', onMouseDownInsideMenu)
document.querySelector('.hide-menu').addEventListener('mousedown', onMouseDownInsideMenu)
document.querySelector('.color-pallet').addEventListener('mousedown', onMouseDownInsideMenu)

window.addEventListener('mouseup', onMouseUp)

rangeInput.addEventListener('input', changeInputRangeFillBackground)

hideMenu.addEventListener('click', onHideMenu);

eraserButton.addEventListener('click', onEraser)




// ------------------------ Event Handlers -------------------------------- //

function onChangeLineWidth(){
    if (UI.usingEraser) foregroundCanvas.line.setRadius(minEraserRadius + 5*(lineWidthInputSlider.value/25))
    else foregroundCanvas.line.setRadius(minLineRadius + (lineWidthInputSlider.value/25))
}

function onClearScreen(){
    UI.clearScreen()
}

function onChangeTheme(){
    UI.toggleTheme();
    UI.clearScreen();
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


export { UI }