const keys = require("./modules/keys")

keys.start()
keys.on('k', ()=>{console.log('k')})