/**
  Represent the names of all the events used by the app.
  The respective event objects will be auto-generated in
  the eventObj variable below once the event String is 
  added to this object.
*/
const eventString = {
  onColorSelected:     'color-selected',
  onLineWidthChange:   'line-width-change',
  onReaserSelected:    'eraser-selected',
  onReset:             'reset',
}

/*
  Will be auto-generated by the for loop below
*/
const eventObj = {}


for (let [key, value] of Object.entries(eventString)){
  eventObj[key] = new Event(value);
}


export { eventString , eventObj };