import { foregroundCanvas , backgroundCanvas } from '/src/foreground-canvas.js'


// Color pallet - add new colors to the list
const colors = [ 
    'rgba(255, 255, 255, 1)' ,
    'rgba(255, 242, 129, 1)' ,
    'rgba(106, 120, 245, 1)'   ,
    'rgba(236, 117, 139, 1)'   ,
    'rgba(109, 251, 157, 1)'   ,
    'rgba(0,   0,   0,   1)'
]

const lineWidthInputSlider = document.querySelector('.line-width')
const rangeInput = document.querySelector('input[type="range"]')
const colorPallet = document.querySelector('.color-pallet')
const colorDefaultSize = 35; // color-pallet squares size in pixels
const minRadius = 1;


const UI = {
    isInsideMenu: false,
    color: "black",
    lineWidth: minRadius,

    setLineColor: function(color) {
        this.color = color
    },

    setLineWidth: function(lineWidth) {
        this.lineWidth = lineWidth
    },

    getLineColor: function() {
        return this.color
    },

    getLineWidth: function() {
        return this.lineWidth
    },

    toggleInsideMenu: function() {
        this.isInsideMenu = !this.isInsideMenu
    },

}

// ------------------------ Color Pallet -------------------------------- //
const borderColor = "#EDEDED"


colors.forEach((color) => {
    // Add the collors to the DOM
    var div = document.createElement('div')
    div.style.backgroundColor = color
    /* div.style.width =   `${colorDefaultSize}px`
    div.style.height =  `${colorDefaultSize}px` */
    div.style.transition = "all 200ms ease-in-out"
    div.classList.add("color-btn", "btn-border", "btn-hoverable")
    colorPallet.appendChild(div)


    // To change line color
    div.addEventListener('click', () => {
        foregroundCanvas.line.setColor(div.style.backgroundColor)

        var colors = [...colorPallet.children]
        colors.forEach( (color) => { // reset all colors' border
            color.style.borderColor =  borderColor
            color.style.borderRadius = "30%"
            color.style.borderWidth = "2px"
        })
        // put border only on the clicked one
        div.style.borderWidth = "8px"
        div.style.borderColor = "#6A78F5"
        div.style.borderRadius = "50%"

    })

})

// ------------------------ LINE WIDTH --------------------------- //

lineWidthInputSlider.addEventListener('change', function() {
    foregroundCanvas.line.setRadius(minRadius + (lineWidthInputSlider.value/25));
})


// ------------------------ CLEAR SCREEN --------------------------- //

document.querySelector('.clear-screen').addEventListener('mousedown', () => {
    foregroundCanvas.clearScreen()
/*     backgroundCanvas.clearScreen() */
})

document.querySelector('.ui').addEventListener('mousedown', () => {
    UI.isInsideMenu = true
})

window.addEventListener('mouseup', () => {
    UI.isInsideMenu = false
})

rangeInput.addEventListener('input', changeInputRangeFillBackground)

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



export { UI }