
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.keys = factory();
    }
}(this, function () {

    'use strict';

    // tracking state
    // find keycodes here: https://keycode.info/
    let listening = {};

    export function start() {
        window.addEventListener('keydown', keydownHandler, { passive: false });
        window.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', blurHandler);
    }

    export function stop() {
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        window.removeEventListener('blur', blurHandler);
    }

    export function on(keycodes, callback) { listening[keycodes] = callback; }
    export function off(keycodes) { delete listening[keycodes]; }
    export function clear() { listening = {}; }

    function keydownHandler(e) {
        // include to prevent key events while composing text
        if (e.isComposing || e.keyCode === 229) { return; }

        // add key code to keys.down[]
        keys.down[e.keyCode] = true;

        // check all keys we are listening to
        for (const [shortcut, callback] of Object.entries(listening)) {
            let keyCodes = shortcut.split(' ');

            // make sure the last key pressed is the last one in the shortcut
            if (keyCodes.pop() != e.keyCode) break;

            // make sure all the shortcut keys are down
            if (!keyCodes.every(keyCode => keys.down[keyCode])) break;

            callback(e);
            return;
        }
    }

    function keyupHandler(e) { keys.down[e.keyCode] = false; }
    function blurHandler(e) { keys.down = {}; }
}));