(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gestures = {}));
}(this, (function (exports) {
    'use strict';

    const gesture = new CustomEvent("gesture", {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
    });

    
/**
 * how do I want people to use the gestures library
 * 
 * listen for the 'gestures' event on an element
 * 
----------------------------------------
1. listen for touch and mouse start events
2. verify that target is being tracked
3. add window

MOUSE -- Assumptions: only one

TOUCHES -- Assumptions: may have more than one

touches track with element they started on 
gestures must be enabled on an element
 - this adds the touchstart and mousedown eventlisteners
 - touches have 
track all touches that started on a tracked target


----------------------------------------
 * 
 */


    //exports.enabled = false;
    Object.defineProperty(exports, '__esModule', { value: true });
})));