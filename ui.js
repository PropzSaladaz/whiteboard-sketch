import {line} from '/canvas.js'
export { insideUI }

var insideUI = false;
const lineWidthInputSlider = document.querySelector('.line-width')

// Color pallet - add new colors to the list
const colors = [ 
    'rgb(0,     217,    255)' ,
    'rgb(0,     26,     255)' ,
    'rgb(255,   208,    0)'   ,
    'rgb(255,   0,      0)'   ,
    'rgb(5,     145,    0)'   ,
    'rgb(0,     0,      0)'
]
const colorDefaultSize = 35; // in pixels

const colorPallet = document.querySelector('.color-pallet')

colors.forEach((color) => {
    // Add the collors to the DOM
    var div = document.createElement('div')
    div.style.backgroundColor = color
    div.style.width = `${colorDefaultSize}px`
    div.style.height = `${colorDefaultSize}px`
    div.style.transition = "all 200ms ease-in-out"
    colorPallet.appendChild(div)


    // To change line color
    div.addEventListener('click', () => {
        line.setColor(div.style.backgroundColor)

        var colors = [...colorPallet.children]
        colors.forEach( (color) => {
            color.style.border =  "none"
            color.style.width = `${colorDefaultSize}px`
            color.style.height = `${colorDefaultSize}px`
        })

        div.style.border = "5px dotted white"
        div.style.width = `${colorDefaultSize*0.9}px`
        div.style.height = `${colorDefaultSize*0.9}px`
    })

})

// Change line radius --------------------------------------
const minRadius = 1;
lineWidthInputSlider.addEventListener('change', function() {
    line.setRadius(1 + (lineWidthInputSlider.value/25));
})

// Disallow drawing inside UI ------------------------------
document.querySelector('.ui').addEventListener('mousedown', () => {
    insideUI = true;
})

window.addEventListener('mouseup', () => {
    insideUI = false;
})



