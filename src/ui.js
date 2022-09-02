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
 

// Dom elements
const lineWidthInputSlider  = document.querySelector('.line-width')
const rangeInput            = document.querySelector('input[type="range"]')
const colorPalletDOM        = document.querySelector('.color-pallet')
const collorPalletWrapper   = document.querySelector('.color-pallet-wrapper');
const hideMenu              = document.querySelector('.hide-menu');
const menuDOM               = document.querySelector('.main-menu');
const eraserButton          = document.querySelector('.eraser');

// event names
const colorSelected     = new Event('color-selected');
const onLineWidthChange   = new Event('line-width-change');
const onReaserSelected    = new Event('eraser-selected');
const onReset             = new Event('reset');

const minLineRadius   = 1;
const minEraserRadius = 2;

class ColorPallet {
    constructor(mainColor) {
        this.selectedColor = undefined;
        this.colors =  { // each of these colors is a property with DIV appended at the end
            mainColor: mainColor ,
            yellow:    colors.yellow ,
            blue:      colors.blue ,
            red:       colors.red ,
            green:     colors.green 
        };
        /* 
        this.mainColorDIV = 
        ...
        */

        Object.keys(this.colors).forEach(color => {
            // Add the collors to the DOM
            let div = document.createElement('div')
            if (color === this.colors.mainColor) styleSelected(div);
            initializeColorDiv(div, this.colors[color]);
            colorPalletDOM.appendChild(div)
        
            // add event listeners to each to change line color on click
            div.addEventListener('click', () => {
                foregroundCanvas.setLineColor(div.style.backgroundColor);
                this.setSelectedColor(color);
                //this.stopUsingEraser();
        
                let colors = [...colorPalletDOM.children]
                colors.forEach( div => this.styleNotSelectedColor(div)); // reset all colors' style
                this.styleSelectedColor(div) // put border only on the clicked one

                // throw event so that UI can listen and stop using eraser
                colorPalletDOM.dispatchEvent(colorSelected); 
        
            });

            function initializeColorDiv(div, color) {
                div.style.backgroundColor = color;
                div.style.transition = "all 200ms ease-in-out";
                div.classList.add("color-btn", "btn-border", "btn-hoverable");
            };
        });

        const colorNames = Object.keys(this.colors);
        const colorsDIV = document.querySelectorAll('.color-btn');
        for (let index in colorNames ) {
            this[`${colorNames[index]}DIV`] =  colorsDIV[index];
            console.log(`${colorNames[index]}DIV`);
        }
    }

    getColorDiv(color) {
        return this[`${color}DIV`]; // color div properties are in the form "colorDIV"
    }

    styleNotSelectedColor(div) {
        div.classList.remove('selected-color')
    }

    styleSelectedColor(div) {
        div.classList.add('selected-color')
    }

    setMainColor(color) {
        this.colors.mainColor = color;
    }

    getSelectedColor() {
        return colors[this.selectedColor];
    }

    setSelectedColor(color) {
        this.selectedColor = color;
    }

    clearSelectedColor() {
        let colors = document.querySelectorAll(".color-btn");
        colors.forEach(div => div.classList.remove('selected-color'));
        this.selectedColor = undefined;
    }



}


class UserInterface {
    constructor() {
        this.theme               = themes.light
        this.menuWrapper         = menuDOM;
        this.collorPalletWrapper = collorPalletWrapper
        this.isVisible           = true;
        this.isInsideMenu        = false
        this.usingEraser         = false;
        this.lineWidth           = minLineRadius
        this.currentColor        = themes.light.mainLineColor
        this.colorPallet         = new ColorPallet(this.theme.mainLineColor);
        
    }

    setCurrentColor(color) { 
        this.currentColor = color
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

    toggleInsideMenu() {
        this.isInsideMenu = !this.isInsideMenu
    }

    useEraser() {
        this.setCurrentColor(this.theme.eraserColor);
        this.usingEraser = true;
        this.colorPallet.clearSelectedColor();
        foregroundCanvas.setLineColor(this.currentColor);
    }

    stopUsingEraser() {
        this.usingEraser = false;
        lineWidthInputSlider.dispatchEvent(onReset); // send reset event to lineWidthInputSLider to reset line width
    }

    toggleTheme(){
        const isUsingMainColor = (this.currentColor === this.theme.mainLineColor);
        const mainColorButton = this.colorPallet.getColorDiv('mainColor') // select the color of the first button (the main color one)
        this.theme = (this.theme.name === lightMode) ? themes.dark : themes.light;
        if (isUsingMainColor) {
            this.setCurrentColor(this.theme.mainLineColor);
            foregroundCanvas.setLineColor(this.currentColor);
        }
        //colorPalletDOM.mainColor = this.theme.mainLineColor;

        document.querySelector('body').style.backgroundColor = this.theme.backgroundColor;
        mainColorButton.style.backgroundColor = this.theme.mainLineColor; 

        if (this.usingEraser) {
            this.stopUsingEraser();
            this.setLineWidth(minLineRadius);
            foregroundCanvas.setLineWidth(minLineRadius);
            mainColorButton.dispatchEvent(new Event('click')); // simulate a click to select main color
        }
    }

    eventLineWidthChanged() {
        //this.dom.dispatchEvent(lineWidthChange)
    }

    clearScreen() {
        this.setCurrentColor(this.colorPallet.getSelectedColor());
        foregroundCanvas.clearScreen();
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



lineWidthInputSlider.addEventListener('change', onChangeLineWidth);
lineWidthInputSlider.addEventListener('reset', onResetLineWidth);

document.querySelector('.clear-screen').addEventListener('mousedown', onClearScreen)
document.querySelector('.theme').addEventListener('click', onChangeTheme)
document.querySelector('.main-menu').addEventListener('mousedown', onMouseDownInsideMenu)
document.querySelector('.hide-menu').addEventListener('mousedown', onMouseDownInsideMenu)
document.querySelector('.color-pallet').addEventListener('mousedown', onMouseDownInsideMenu)

window.addEventListener('mouseup', onMouseUp)

rangeInput.addEventListener('input', changeInputRangeFillBackground)

hideMenu.addEventListener('click', onHideMenu);

eraserButton.addEventListener('click', onEraser)

colorPalletDOM.addEventListener('color-selected', onColorSelected);




// ------------------------ Event Handlers -------------------------------- //

function onResetLineWidth() {
    lineWidthInputSlider.value = (lineWidthInputSlider.max - lineWidthInputSlider.min) / 2;     // set width to half
    foregroundCanvas.setLineWidth(minLineRadius + (lineWidthInputSlider.value/25));             // update width
    rangeInput.dispatchEvent(new Event('input'), { target: lineWidthInputSlider });             // set the slider background to half
}

function onChangeLineWidth(){
    if (UI.usingEraser) foregroundCanvas.setLineWidth(minEraserRadius + 5*(lineWidthInputSlider.value/25))
    else foregroundCanvas.setLineWidth(minLineRadius + (lineWidthInputSlider.value/25))
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

function onColorSelected() {
    UI.stopUsingEraser();
}


export { UI }