/**
 * MOUSE GESTURES -------------------
 * wheel     (see e.detail.event for wheel event details)
 * click
 * middle-click
 * right-click
 * double-click
 * longclick
 * 
 * left-click-drag-start
 * left-click-dragging
 * left-click-drag-end
 * 
 * middle-click-drag-start
 * middle-click-dragging
 * middle-click-drag-end
 * 
 * right-click-drag-start
 * right-click-dragging
 * right-click-drag-end
 * 
 * longclick-drag-start
 * longclick-dragging
 * longclick-drag-end
 * --------------------------------
 * 
 * TOUCH GESTURES -------------------
 * tap
 * doubletap
 * longpress
 * 
 * touch-drag-start
 * touch-dragging
 * touch-drag-end
 * 
 * longpress-drag-start
 * longpress-dragging
 * longpress-drag-end
 * 
 * pinch-start
 * pinching
 * pinch-end
 * --------------------------------
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
    const DOUBLE_CLICK_DELAY = 300; // reduce to 100 to remove double clicks

    // STATE MANAGEMENT
    let trackedElms = [],
        activeMouseElm = undefined,
        mouseMoving = false,
        mouseButton = 0, // 0 = left, 1 = middle, 2 = right
        clicks = 0,
        mouseupTime = 0,
        mouseDown = false,
        lastMouseX = 0,
        lastMouseY = 0,
        activeTouchElm = undefined,
        dragging = false,
        pinching = false,
        longpressed = false,
        longclicked = false,
        taps = 0,
        lastTouchEndTime = 0,
        hypo = undefined,
        lastCenterX = 0,
        lastCenterY = 0,
        touch = { identifier: undefined, x: 0, y: 0 };

    // ************ HELPER FUNCTIONS **************
    function copyTouch(newTouch) {
        return {
            identifier: newTouch.identifier,
            x: newTouch.clientX,
            y: newTouch.clientY
        }
    }

    function dispatchGesture(elm, event, data) {
        data.event = event;
        let e = new CustomEvent("gesture", {
            detail: data,
            bubbles: false,
            cancelable: false
        })

        elm.dispatchEvent(e);
    }
    // *********** END HELPER FUNCTIONS ***********


    // ************** EVENT HANDLERS **************
    function blurHandler(e) {
        // Keep in mind that blur is a window event
        console.log("BLUR HANDLER");

        // remove other window event handlers
        window.removeEventListener('mousemove', mousemoveHandler);
        window.removeEventListener('mouseup', mouseupHandler);

        mouseupTime = new Date();
        mouseDown = false;

        // MOUSE DRAG END DETECTION
        if (mouseMoving) {
            switch (mouseButton) {
                case 0:
                    dispatchGesture(activeMouseElm, e, { name: "left-click-drag-end", x: lastMouseX, y: lastMouseY });
                    break;
                case 1:
                    dispatchGesture(activeMouseElm, e, { name: "middle-click-drag-end", x: lastMouseX, y: lastMouseY });
                    break;
                case 2:
                    dispatchGesture(activeMouseElm, e, { name: "right-click-drag-end", x: lastMouseX, y: lastMouseY });
                    break;
            }
            mouseMoving = false;
        }
    }

    function wheelHandler(e) {
        dispatchGesture(this, e, { name: "wheel", x: e.clientX, y: e.clientY, event: e })

        e.preventDefault();
        e.stopPropagation();

    }

    function contextmenuHandler(e) {
        // right-clicks are handled in the mouseup handler
        e.preventDefault();
        e.stopPropagation();

    }

    function mousedownHandler(e) {
        //mouseMoving = false; TODO: delete?
        // return if mouse down is on an active text field
        if (document.activeElement == e.target) return;

        window.addEventListener('mousemove', mousemoveHandler);
        window.addEventListener('mouseup', mouseupHandler);

        activeMouseElm = this;
        mouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (!mouseMoving) { mouseButton = e.button; }

        // LONGCLICK DETECTION
        if (mouseButton == 0) {
            window.setTimeout(function () {
                let now = new Date();
                if (now - mouseupTime >= LONG_CLICK_DELAY && !mouseMoving) {
                    //window.removeEventListener('mousemove', mousemoveHandler);
                    //window.removeEventListener('mouseup', mouseupHandler);

                    longclicked = true;
                    dispatchGesture(activeMouseElm, e, { name: "longclick", x: e.clientX, y: e.clientY })
                }
            }, LONG_CLICK_DELAY)
        }

        e.preventDefault();
        e.stopPropagation();
    }

    function mousemoveHandler(e) {
        // return if no movement has taken place
        let dx = e.clientX - lastMouseX,
            dy = e.clientY - lastMouseY;
        if (dx == 0 && dy == 0) return;

        // MOUSE DRAG START DETECTION
        if (!mouseMoving) {
            if (longclicked) {
                dispatchGesture(activeMouseElm, e, { name: "longclick-drag-start", x: e.clientX, y: e.clientY });
            } else {
                switch (mouseButton) {
                    case 0:
                        dispatchGesture(activeMouseElm, e, { name: "left-click-drag-start", x: e.clientX, y: e.clientY });
                        break;
                    case 1:
                        dispatchGesture(activeMouseElm, e, { name: "middle-click-drag-start", x: e.clientX, y: e.clientY });
                        break;
                    case 2:
                        dispatchGesture(activeMouseElm, e, { name: "right-click-drag-start", x: e.clientX, y: e.clientY });
                        break;
                }
            }
        }

        // MOUUSE DRAGGING DETECTION
        mouseMoving = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        if (longclicked) {
            dispatchGesture(activeMouseElm, e, { name: "longclick-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
        } else {
            switch (mouseButton) {
                case 0:
                    dispatchGesture(activeMouseElm, e, { name: "left-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                    break;
                case 1:
                    dispatchGesture(activeMouseElm, e, { name: "middle-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                    break;
                case 2:
                    dispatchGesture(activeMouseElm, e, { name: "right-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                    break;
            }
        }
    }

    function mouseupHandler(e) {
        // remove window event handlers
        window.removeEventListener('mousemove', mousemoveHandler);
        window.removeEventListener('mouseup', mouseupHandler);

        mouseupTime = new Date();
        mouseDown = false;

        if (mouseMoving) {
            // MOUSE DRAG END DETECTION
            if (longclicked) {
                dispatchGesture(activeMouseElm, e, { name: "longclick-drag-end", x: lastMouseX, y: lastMouseY });
            } else {
                switch (mouseButton) {
                    case 0:
                        dispatchGesture(activeMouseElm, e, { name: "left-click-drag-end", x: lastMouseX, y: lastMouseY });
                        break;
                    case 1:
                        dispatchGesture(activeMouseElm, e, { name: "middle-click-drag-end", x: lastMouseX, y: lastMouseY });
                        break;
                    case 2:
                        dispatchGesture(activeMouseElm, e, { name: "right-click-drag-end", x: lastMouseX, y: lastMouseY });
                        break;
                }
            }

            mouseMoving = false;
        } else {
            // RIGHT CLICK DETECTION
            if (e.which === 3 || e.button === 2) {
                dispatchGesture(activeMouseElm, e, { name: "right-click", x: e.clientX, y: e.clientY });
            } else if (e.which === 2 || e.button === 1) {
                dispatchGesture(activeMouseElm, e, { name: "middle-click", x: e.clientX, y: e.clientY });
            } else {
                // CLICK DETECTION
                if (clicks == 0) dispatchGesture(activeMouseElm, e, { name: "click", x: e.clientX, y: e.clientY });

                // DOUBLE CLICK DETECTION
                clicks++;
                window.setTimeout(function () {
                    if (clicks > 1) dispatchGesture(activeMouseElm, e, { name: "double-click", x: e.clientX, y: e.clientY });
                    clicks = 0;
                }, DOUBLE_CLICK_DELAY);
            }
        }

        longclicked = false;
    }

    function touchstartHandler(e) {
        // prevent pinch-zoom
        if (e.touches.length > 1) {
            e.preventDefault();
            e.stopPropagation();
        }

        // return if touch is on an active text field
        if (document.activeElement == e.target) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();


        // don't handle multiple touches if already tracking a touch
        if (e.touches.length > 1) {
            if (e.touches[0].identifier == touch.identifier) return;
            pinching = true;
        }

        window.addEventListener('touchmove', touchmoveHandler, { passive: false });
        window.addEventListener('touchend', touchendHandler);
        window.addEventListener('touchcancel', touchendHandler);

        // update primary touch location
        touch = copyTouch(e.touches[0]);
        activeTouchElm = this;

        // longpress DETECTION
        window.setTimeout(function () {
            // cancel long press if in the middle of a gesture
            if (dragging || pinching) return;

            // verify the touch hasn't been released
            let now = new Date();
            if (now - lastTouchEndTime >= LONG_PRESS_DELAY) {
                dragging = false;
                pinching = false;
                hypo = undefined;
                longpressed = true;

                dispatchGesture(activeTouchElm, e, { name: "longpress", x: touch.x, y: touch.y })
            }
        }, LONG_PRESS_DELAY);
    }

    function touchmoveHandler(e) {
        e.preventDefault();
        e.stopPropagation();


        if (dragging) {
            let lastX = touch.x,
                lastY = touch.y;

            touch = copyTouch(e.touches[0]);

            // calculate change in x and y from last touch event
            let dx = touch.x - lastX,
                dy = touch.y - lastY;

            if (longpressed) {
                dispatchGesture(activeTouchElm, e, { name: "longpress-dragging", x: touch.x, y: touch.y, dx: dx, dy: dy })
            } else {
                dispatchGesture(activeTouchElm, e, { name: "touch-dragging", x: touch.x, y: touch.y, dx: dx, dy: dy });
            }
            return;
        } else if (!longpressed && (pinching || e.touches.length > 1)) {
            touch = copyTouch(e.touches[0]);
            let touch2 = copyTouch(e.touches[1]);
            let center = {
                x: (touch.x + touch2.x) / 2,
                y: (touch.y + touch2.y) / 2
            }

            let hypo1 = Math.hypot((touch.x - touch2.x), (touch.y - touch2.y));
            if (hypo === undefined) {
                hypo = hypo1;
                lastCenterX = center.x;
                lastCenterY = center.y;
                dispatchGesture(activeTouchElm, e, { name: "pinch-start", x: center.x, y: center.y })
            }

            pinching = true;
            let zoom = hypo1 / hypo;
            let dx = center.x - lastCenterX,
                dy = center.y - lastCenterY;
            dispatchGesture(activeTouchElm, e, { name: "pinching", x: center.x, y: center.y, zoom: zoom, dx: dx, dy: dy });
            hypo = hypo1;
            lastCenterX = center.x;
            lastCenterY = center.y;
            return;
        } else {
            dragging = true;
            if (longpressed) {
                dispatchGesture(activeTouchElm, e, { name: "longpress-drag-start", x: touch.x, y: touch.y })
                touch = copyTouch(e.touches[0]);
                dispatchGesture(activeTouchElm, e, { name: "longpress-dragging", x: touch.x, y: touch.y, dx: 0, dy: 0 });

            } else {
                dispatchGesture(activeTouchElm, e, { name: "touch-drag-start", x: touch.x, y: touch.y });
                touch = copyTouch(e.touches[0]);
                dispatchGesture(activeTouchElm, e, { name: "touch-dragging", x: touch.x, y: touch.y, dx: 0, dy: 0 });
            }
        }
    }

    function touchendHandler(e) {
        if (dragging &&
            e.touches.length > 0 &&
            e.touches[0].identifier == touch.identifier) {
            return;
        }

        lastTouchEndTime = new Date();
        window.removeEventListener('touchmove', touchmoveHandler);
        window.removeEventListener('touchend', touchendHandler);
        window.removeEventListener('touchcancel', touchendHandler);

        if (dragging) {
            dragging = false;
            if (longpressed) {
                dispatchGesture(activeTouchElm, e, { name: "longpress-drag-end", x: touch.x, y: touch.y });
            } else {
                dispatchGesture(activeTouchElm, e, { name: "touch-drag-end", x: touch.x, y: touch.y });
            }
        } else if (pinching) {
            pinching = false;
            hypo = undefined;
            dispatchGesture(activeTouchElm, e, { name: "pinch-end", x: touch.x, y: touch.y })
        } else if (!longpressed) {
            // TAP DETECTION
            if (taps == 0) dispatchGesture(activeTouchElm, e, { name: "tap", x: touch.x, y: touch.y });

            // DOUBLE TAP DETECTION
            taps++;
            window.setTimeout(function () {
                if (taps > 1) dispatchGesture(activeTouchElm, e, { name: "doubletap", x: touch.x, y: touch.y });
                taps = 0;
            }, DOUBLE_TAP_DELAY);
        }

        longpressed = false;
    }
    // ************ END EVENT HANDLERS ************

    // ************ BEGIN PUBLIC METHODS ************
    function track(elm) {
        // return if element is already being tracked
        for (var i = 0; i < trackedElms.length; i++) {
            if (elm === trackedElms[i]) {
                throw new Error("Element is already being tracked!");
            }
        }

        // add window event listeners if this is the first tracked element
        if (trackedElms.length == 0) {
            window.addEventListener('blur', blurHandler);
        }

        // start tracking the element
        trackedElms.push(elm);

        // add event listeners
        elm.addEventListener('touchstart', touchstartHandler, { passive: false });

        elm.addEventListener('mousedown', mousedownHandler, { passive: false });
        elm.addEventListener('wheel', wheelHandler, { passive: false });
        elm.addEventListener('contextmenu', contextmenuHandler, { passive: false });

    }

    function untrack(elm) {
        // make sure element is actually being tracked
        for (var i = 0; i < trackedElms.length; i++) {
            if (elm === trackedElms[i]) {

                // stop tracking the element
                trackedElms.splice(i, 1);

                // remove event listeners
                elm.removeEventListener('touchstart', touchstartHandler);
                elm.removeEventListener('mousedown', mousedownHandler);
                elm.removeEventListener('wheel', wheelHandler);
                elm.removeEventListener('contextmenu', contextmenuHandler);

                // remove window event listeners if everything is untracked
                if (trackedElms.length == 0) {
                    window.removeEventListener('blur', blurHandler);
                }
                return;
            }
        }
        throw new Error("Element was not being tracked!");
    }

    function untrackAll() {
        while (trackedElms.length > 0) {
            untrack(trackedElms[0]);
        }
    }

    function printTrackedElms() { console.log(trackedElms) };
    // ************ END PUBLIC METHODS ************

    // ****************** EXPORTS ***********************
    exports.untrack = untrack;
    exports.untrackAll = untrackAll;
    exports.track = track;
    exports.printTrackedElms = printTrackedElms;
    // ****************** END EXPORTS ********************

    Object.defineProperty(exports, '__esModule', { value: true });
})));