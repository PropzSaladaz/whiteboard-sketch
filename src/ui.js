import { foregroundCanvas } from '/src/foreground-canvas.js'


// Color pallet - add new colors to the list
const colors = [ 
    'rgb(0,     217,    255)' ,
    'rgb(0,     26,     255)' ,
    'rgb(255,   208,    0)'   ,
    'rgb(255,   0,      0)'   ,
    'rgb(5,     145,    0)'   ,
    'rgb(0,     0,      0)'
]

const lineWidthInputSlider = document.querySelector('.line-width')
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

colors.forEach((color) => {
    // Add the collors to the DOM
    var div = document.createElement('div')
    div.style.backgroundColor = color
    div.style.width =   `${colorDefaultSize}px`
    div.style.height =  `${colorDefaultSize}px`
    div.style.transition = "all 200ms ease-in-out"
    colorPallet.appendChild(div)


    // To change line color
    div.addEventListener('click', () => {
        foregroundCanvas.line.setColor(div.style.backgroundColor)

        var colors = [...colorPallet.children]
        colors.forEach( (color) => { // reset al colors' border
            color.style.border =  "none"
            color.style.width  =  `${colorDefaultSize}px`
            color.style.height =  `${colorDefaultSize}px`
        })
        // put border only on the clicked one
        div.style.border = "5px dotted white"
        div.style.width = `${colorDefaultSize*0.9}px`
        div.style.height = `${colorDefaultSize*0.9}px`
    })

})

// ------------------------ LINE WIDTH --------------------------- //

lineWidthInputSlider.addEventListener('change', function() {
    foregroundCanvas.line.setRadius(minRadius + (lineWidthInputSlider.value/25));
})


// ------------------------ CLEAR SCREEN --------------------------- //

document.querySelector('.clear-screen-btn').addEventListener('mousedown', () => {
    foregroundCanvas.clearScreen()
})

document.querySelector('.ui').addEventListener('mousedown', () => {
    UI.isInsideMenu = true
})

window.addEventListener('mouseup', () => {
    UI.isInsideMenu = false
})


export { UI }