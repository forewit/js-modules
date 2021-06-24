/**
 * Valid gestures:
 *      mouseDragEnd 		-> x, y
 *      click			    -> x, y
 *      right-click		    -> x, y
 *      longClick 		    -> x, y
 *      doubleClick		    -> x, y
 *      mouseDragStart		-> x, y
 *      mouseDragging       -> x, y
 *      mouseDragEnd		-> x, y
 *      longpress		    -> x, y
 *      longpressDragStart	-> x, y
 *      longpressDragging	-> x, y
 *      longpressDragEnd    -> x, y
 *      touchDragStart		-> x, y
 *      touchDragging		-> x, y
 *      touchDragEnd
 *      pinchStart		    -> x, y
 *      pinching		    -> x, y, scale
 *      pinchEnd
 *      tap			        -> x, y
 *      doubleTap		    -> x, y
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gestures = {}));
}(this, (function (exports) {
    'use strict';

    // PREFERENCES
    const LONG_PRESS_DELAY = 500;
    const DOUBLE_TAP_DELAY = 300; // reduce to 100 to remove double taps
    const LONG_CLICK_DELAY = 500;
    const DOUBLE_CLICK_DELAY = 300; // reduce to 100 to remove double taps

    // STATE MANAGEMENT
    let trackedElms = [],
        dragging = false,
        pinching = false,
        longpressed = false,
        mouseMoving = false,
        taps = 0,
        clicks = 0,
        lastTouchEndTime = 0,
        mouseupTime = 0,
        hypo = undefined,
        mouse = { down: false, x: 0, y: 0 },
        touches = [];

    // ************ HELPER FUNCTIONS **************
    function noop() { };

    function copyTouch(newTouch) {
        return {
            identifier: newTouch.identifier,
            x: newTouch.clientX,
            y: newTouch.clientY
        }
    }

    function dispatchGesture(name, elm, data) {
        let gestureEvent = new CustomEvent("gesture", {
            detail: { name: name, data: data },
            bubbles: false,
            cancelable: false
        })

        elm.dispatchEvent(gestureEvent);
    }
    // *********** END HELPER FUNCTIONS ***********


    // ************** EVENT HANDLERS **************

    // Keep in mind that blur is a window event
    function blurHandler(e) {
        console.log("BLUR HANDLER");

        // remove other window event handlers
        window.removeEventListener('mousemove', mousemoveHandler);
        window.removeEventListener('mouseup', mouseupHandler);

        mouseupTime = new Date();
        mouse.down = false;

        // MOUSE DRAG END DETECTION
        if (mouseMoving) {
            // TODO: trigger "mousedragend" gesture on applicable elements
        }
    }

    function wheelHandler(e) {
        dispatchGesture("wheel", e.target, e);

        e.preventDefault();
        e.stopPropagation();
    }

    function contextmenuHandler(e) {
        dispatchGesture("right-click", e.target, e)

        e.preventDefault();
        e.stopPropagation();
    }

    function mousedownHandler(e) {
        mouseMoving = false;

        window.addEventListener('mousemove', mousemoveHandler, { passive: false });
        window.addEventListener('mouseup', mouseupHandler);

        mouse.down = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // LONGCLICK DETECTION
        window.setTimeout(function () {
            let now = new Date();
            if (now - mouseupTime >= LONG_CLICK_DELAY && !mouseMoving) {
                window.removeEventListener('mousemove', mousemoveHandler);
                window.removeEventListener('mouseup', mouseupHandler);

                dispatchGesture("longclick", e.target, { x: mouse.x, y: mouse.y });
            }
        }, LONG_CLICK_DELAY)

        e.preventDefault();
        e.stopPropagation();
    }

    function mousemoveHandler(e) {
        // MOUSE DRAG START DETECTION
        if (!mouseMoving) dispatchGesture("mouse-drag-start", e.target, { x: mouse.x, y: mouse.y })

        mouseMoving = true;

        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // MOUUSE DRAGGING DETECTION
        dispatchGesture("mouse-dragging", e.target, { x: mouse.x, y: mouse.y })
    }
    function mouseupHandler(e) {

    }
    // ************ END EVENT HANDLERS ************


    // ****************** EXPORTS ***********************
    exports.track = function (elm) {
        // return if element is already being tracked
        for (var i = 0; i < trackedElms.length; i++) {
            if (elm === trackedElms[i]) return;
        }

        // add window event listeners if this is the first tracked element
        if (trackedElms.length == 0) {
            window.addEventListener('blur', blurHandler);
        }

        // start tracking the element
        trackedElms.push(elm);

        // add event listeners
        elm.addEventListener('mousedown', mousedownHandler, { passive: false });
        elm.addEventListener('wheel', wheelHandler, { passive: false });
        elm.addEventListener('contextmenu', contextmenuHandler, { passive: false });
    }

    exports.untrack = function (elm) {
        // make sure element is actually being tracked
        for (var i = 0; i < trackedElms.length; i++) {
            if (elm === trackedElms[i]) {

                // stop tracking the element
                trackedElms.splice(i, 1);

                // remove event listeners
                elm.removeEventListener('mousedown', mousedownHandler);
                elm.removeEventListener('wheel', wheelHandler);
                elm.removeEventListener('contextmenu', contextmenuHandler);
            }
        }

        // remove window event listeners if everything is untracked
        if (trackedElms.length == 0) {
            window.addEventListener('blur', blurHandler);
        }
    }

    exports.untrackAll = function () {
        for (var i = 0; i < trackedElms.length; i++) {
            untrack(trackedElms[i]);
        }
    }
    // ****************** END EXPORTS ********************

    // ************* DEBUGGING ****************
    exports.printTrackedElms = function () { console.log(trackedElms) };
    // ****************************************

    Object.defineProperty(exports, '__esModule', { value: true });
})));