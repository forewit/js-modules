// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let gesturesElm = document.getElementById('gestures');
let testGestures = new Gestures(gesturesElm);
testGestures.on('pinching', ()=>{console.log('pinching'); gesturesElm.innerHTML="pinching"})
testGestures.on('touchDragging', ()=>{console.log('touch dragging'); gesturesElm.innerHTML="touch dragging"})
testGestures.on('touchDragEnd', ()=>{console.log('touch drag end'); gesturesElm.innerHTML="touch drag end"})
testGestures.on('longpress', ()=>{console.log('longpress'); gesturesElm.innerHTML="longpress"})
testGestures.on('tap', ()=>{console.log('tap'); gesturesElm.innerHTML="tap"})
testGestures.on('doubleTap', ()=>{console.log('double tap'); gesturesElm.innerHTML="double tap"})
testGestures.on('click', ()=>{console.log('click'); gesturesElm.innerHTML="click"})
testGestures.on('doubleClick', ()=>{console.log('double click'); gesturesElm.innerHTML="double click"})
testGestures.on('longClick', ()=>{console.log('long click'); gesturesElm.innerHTML="long click"})
testGestures.on('rightClick', ()=>{console.log('right click'); gesturesElm.innerHTML="right click"})
testGestures.on('mouseDragging', ()=>{console.log('mouse dragging'); gesturesElm.innerHTML="mouse dragging"})
testGestures.on('mouseDragEnd', ()=>{console.log('mouse drag end'); gesturesElm.innerHTML="mouse drag end"})
testGestures.on('longpressDragging', ()=>{console.log('longpress dragging'); gesturesElm.innerHTML="longpress dragging"})
testGestures.on('longpressDragEnd', ()=>{console.log('longpress drag end'); gesturesElm.innerHTML="longpress drag end"})
testGestures.start();

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
new Pen(document.getElementById('pen'));

// testing Toolbar.js
let toolbar = new Toolbar(document.getElementById("toolbar"), true);


// testing newgestures.js
let newgesturesElm = document.getElementById("newgestures");
gestures.track(newgesturesElm);

newgesturesElm.addEventListener("gesture", function(e) {
    console.log(e.detail);
});