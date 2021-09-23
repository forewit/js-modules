// TESTING KEYS MODULE
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// TESTING PEN MODULE
new Pen(document.getElementById('pen'));

// TESTING FILES MODULE
// alternate -- files.newDropZone(document.getElementById('drop-region'));
let dropzoneElm = document.getElementById('files');
new files.Dropzone(
    dropzoneElm, 
    dropzoneElm, 
    (img)=>{console.log('callback', img)},
    {hoverClass:"dragover"}
);

// TESTING GESTURES MODULE
let newgesturesElm = document.getElementById("gestures");
gestures.track(newgesturesElm);

newgesturesElm.addEventListener("gesture", function(e) {
    console.log(e.detail.name, e.detail.x, e.detail.y);
});