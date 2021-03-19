// testing keys.js
keys.on('17 65', ()=>{console.log('ctrl + a')})
keys.start()

// testing Gestures.js
let bodyGestures = new Gestures(document.getElementById('gesture-div'));
bodyGestures.on('doubleClick', ()=>{console.log('double click')});
bodyGestures.start();