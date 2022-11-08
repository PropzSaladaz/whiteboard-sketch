import colors from '/src/ui/colors.js';
import { FOREGROUND_CANVAS_DOM, MENU_DOM, COLOR_PALLET_DOM } from '../../domElements.js';
import { eventObj, eventString } from '../../events.js';

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

      Object.keys(this.colors).forEach(color => {
          // Add the collors to the DOM
          let div = document.createElement('div')
          if (color === this.colors.mainColor) styleSelected(div);
          initializeColorDiv(div, this.colors[color]);
          COLOR_PALLET_DOM.appendChild(div)
      
          // add event listeners to each to change line color on click
          div.addEventListener('click', () => {
            let colorEvent = eventObj.onColorSelected.setColor(div.style.backgroundColor);
            FOREGROUND_CANVAS_DOM.dispatchEvent(colorEvent);
            MENU_DOM.dispatchEvent(colorEvent);
            // setLineColor(div.style.backgroundColor)
              this.setSelectedColor(color);
              //this.stopUsingEraser();
      
              let colors = [...COLOR_PALLET_DOM.children]
              colors.forEach( div => this.styleNotSelectedColor(div)); // reset all colors' style
              this.styleSelectedColor(div) // put border only on the clicked one

              // throw event so that UI can listen and stop using eraser
              MENU_DOM.dispatchEvent(eventObj.onColorSelected); 
      
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
          //console.log(`${colorNames[index]}DIV`);
      }
  }

  getColorDiv(color) {
      return this[`${color}DIV`]; // color div properties are in the form "colorDIV"
  }

  getDomElement(){ 
    return this.domElement; 
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
    console.log("get selected color " + colors[this.selectedColor]);
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

  get domElement() {
    return COLOR_PALLET_DOM;
  }
}

export default ColorPallet;