// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let divGestures = new Gestures(document.getElementById('gesture-div'));
divGestures.on('doubleClick', ()=>{console.log('double click')});
divGestures.start();

// testing Draggable.js
let divDraggable = new Draggable(document.getElementById('draggable-div'));
