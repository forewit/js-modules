let elm = document.getElementById('draggable');

// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let spacer = document.getElementById('spacer');
let spacerGestures = new Gestures(spacer);
/*
spacerGestures.on('pinching', ()=>{console.log('pinching'); spacer.innerHTML="pinching"})
spacerGestures.on('touchDragging', ()=>{console.log('touch dragging'); spacer.innerHTML="touch dragging"})
spacerGestures.on('touchDragEnd', ()=>{console.log('touch drag end'); spacer.innerHTML="touch drag end"})
spacerGestures.on('longpress', ()=>{console.log('longpress'); spacer.innerHTML="longpress"})
spacerGestures.on('tap', ()=>{console.log('tap'); spacer.innerHTML="tap"})
spacerGestures.on('doubleTap', ()=>{console.log('double tap'); spacer.innerHTML="double tap"})
spacerGestures.on('click', ()=>{console.log('click'); spacer.innerHTML="click"})
spacerGestures.on('doubleClick', ()=>{console.log('double click'); spacer.innerHTML="double click"})
spacerGestures.on('longClick', ()=>{console.log('long click'); spacer.innerHTML="long click"})
spacerGestures.on('rightClick', ()=>{console.log('right click'); spacer.innerHTML="right click"})
spacerGestures.on('mouseDragging', ()=>{console.log('mouse dragging'); spacer.innerHTML="mouse dragging"})
spacerGestures.on('mouseDragEnd', ()=>{console.log('mouse drag end'); spacer.innerHTML="mouse drag end"})
spacerGestures.on('longpressDragging', ()=>{console.log('longpress dragging'); spacer.innerHTML="longpress dragging"})
spacerGestures.on('longpressDragEnd', ()=>{console.log('longpress drag end'); spacer.innerHTML="longpress drag end"})
*/
spacerGestures.start();

// testing Draggable.js
new Draggable(elm, {placeholderClass:"placeholder"});

// testing files.js
//files.newDropZone(document.getElementById('drop-region'));

let dropzone = document.getElementById('drop-region');
new files.Dropzone(
    dropzone, 
    dropzone, 
    ()=>{console.log('callback')},
    {hoverClass:"dragover"}
);
