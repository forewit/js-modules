let elm = document.getElementById('testing-div');

// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let gestures = new Gestures(elm);
gestures.on('doubleClick', ()=>{console.log('double click')});
gestures.start();

// testing Draggable.js
new Draggable(elm);
