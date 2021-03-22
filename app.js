let elm = document.getElementById('testing-div');

// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let gestures = new Gestures(elm);
gestures.on('doubleClick', ()=>{console.log('double click')});
gestures.start();

let spacer = document.getElementById('spacer');
let spacerGestures = new Gestures(spacer);
spacerGestures.on('pinching', ()=>{console.log('pinching'); spacer.innerHTML="pinching"})
spacerGestures.on('touchDragStart', ()=>{console.log('touch drag start'); spacer.innerHTML="touch drag start"})
spacerGestures.on('touchDragging', ()=>{console.log('touch dragging'); spacer.innerHTML="touch dragging"})
spacerGestures.on('touchDragEnd', ()=>{console.log('touch drag end'); spacer.innerHTML="touch drag end"})
spacerGestures.on('longPress', ()=>{console.log('longPress'); spacer.innerHTML="longPress"})
spacerGestures.on('tap', ()=>{console.log('tap'); spacer.innerHTML="tap"})
spacerGestures.on('doubleTap', ()=>{console.log('double tap'); spacer.innerHTML="double tap"})


spacerGestures.start();

// testing Draggable.js
new Draggable(elm);

// testing files.js
//files.newDropZone(document.getElementById('drop-region'));

let dropzone = document.getElementById('drop-region');
new files.Dropzone(
    dropzone, 
    dropzone, 
    ()=>{console.log('callback')},
    {hoverClass:"dragover"}
);
