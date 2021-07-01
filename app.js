// TESTING KEYS.JS
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()


// TESTING FILES.JS
// alternate -- files.newDropZone(document.getElementById('drop-region'));
let dropzoneElm = document.getElementById('files');
new files.Dropzone(
    dropzoneElm, 
    dropzoneElm, 
    ()=>{console.log('callback')},
    {hoverClass:"dragover"}
);

// TESTING GESTURES.JS
let newgesturesElm = document.getElementById("gestures");
gestures.track(newgesturesElm);

newgesturesElm.addEventListener("gesture", function(e) {
    console.log(e.detail.name, e.detail.x, e.detail.y);
});

// testing pen.js
new Pen(document.getElementById('pen'));

// testing Toolbar.js
let toolbar = new Toolbar(document.getElementById("toolbar"), true);

// testing Draggable.js
new Draggable(document.getElementById('draggable'), {placeholderClass:"placeholder"});
