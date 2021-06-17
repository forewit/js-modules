// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let gesturesElm = document.getElementById('gestures');
let gestures = new Gestures(gesturesElm);
gestures.on('pinching', ()=>{console.log('pinching'); gesturesElm.innerHTML="pinching"})
gestures.on('touchDragging', ()=>{console.log('touch dragging'); gesturesElm.innerHTML="touch dragging"})
gestures.on('touchDragEnd', ()=>{console.log('touch drag end'); gesturesElm.innerHTML="touch drag end"})
gestures.on('longpress', ()=>{console.log('longpress'); gesturesElm.innerHTML="longpress"})
gestures.on('tap', ()=>{console.log('tap'); gesturesElm.innerHTML="tap"})
gestures.on('doubleTap', ()=>{console.log('double tap'); gesturesElm.innerHTML="double tap"})
gestures.on('click', ()=>{console.log('click'); gesturesElm.innerHTML="click"})
gestures.on('doubleClick', ()=>{console.log('double click'); gesturesElm.innerHTML="double click"})
gestures.on('longClick', ()=>{console.log('long click'); gesturesElm.innerHTML="long click"})
gestures.on('rightClick', ()=>{console.log('right click'); gesturesElm.innerHTML="right click"})
gestures.on('mouseDragging', ()=>{console.log('mouse dragging'); gesturesElm.innerHTML="mouse dragging"})
gestures.on('mouseDragEnd', ()=>{console.log('mouse drag end'); gesturesElm.innerHTML="mouse drag end"})
gestures.on('longpressDragging', ()=>{console.log('longpress dragging'); gesturesElm.innerHTML="longpress dragging"})
gestures.on('longpressDragEnd', ()=>{console.log('longpress drag end'); gesturesElm.innerHTML="longpress drag end"})
gestures.start();

// testing Draggable.js
new Draggable(document.getElementById('draggable'), {placeholderClass:"placeholder"});

// testing files.js
// alternate -- files.newDropZone(document.getElementById('drop-region'));
let dropzoneElm = document.getElementById('files');
new files.Dropzone(
    dropzoneElm, 
    dropzoneElm, 
    ()=>{console.log('callback')},
    {hoverClass:"dragover"}
);

// testing pen.js
new pen(document.getElementById('pen'));