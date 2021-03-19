

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Draggable = factory();
    }
}(this, function () {
    'use strict';

    function copyTouch(touch) {
        return { identifier: touch.identifier, x: touch.pageX, y: touch.pageY };
    }
    function noop() {}

    class Draggable {

        constructor(element, options) {
            if (!options) options = {};

            // set attributes
            this.elm = element;
            this.pointer = {};
            this.placeholder = document.createElement("div");
            this.initial_offset = {};
            this.dragging = false;

            // options
            this.handle = (options.handle) ? options.handle : this.elm;
            this.handlers = {
                onStart: (options.onStart) ? options.onStart : noop,
                onMove: (options.onMove) ? options.onMove : noop,
                onEnd: (options.onEnd) ? options.onEnd : noop
            };
            if (options.placeholderClass) this.placeholder.classList.add(options.placeholderClass);

            // bind handlers
            this.startHandler = this.startHandle.bind(this);
            this.moveHandler = this.moveHandle.bind(this);
            this.endHandler = this.endHandle.bind(this);

            // add event listeners
            var me = this;
            me.handle.addEventListener('touchstart', me.startHandler, { passive: false });
            me.handle.addEventListener('mousedown', me.startHandler);
        }

        startHandle(e) {
            var me = this;

            // add event listeners
            if (me.dragging) return;
            if (e.type === 'mousedown') {
                window.addEventListener('mousemove', me.moveHandler, { passive: false });
                window.addEventListener('mouseup', me.endHandler);
                me.pointer = { x: e.pageX, y: e.pageY };
            } else {
                me.handle.addEventListener('touchmove', me.moveHandler, { passive: false });
                me.handle.addEventListener('touchend', me.endHandler);
                me.handle.addEventListener('touchcancel', me.endHandler);
                me.pointer = copyTouch(e.targetTouches[0]);
                e.preventDefault();
                e.stopPropagation();
            }

            // set initial state
            me.initial_offset = {
                x: me.elm.offsetLeft - me.pointer.x,    // adjusted for starting mouse x
                y: me.elm.offsetTop - me.pointer.y,     // adjusted for starting mouse y
            };
        }

        moveHandle(e) {
            var me = this;

            // executes only once
            if (!me.dragging) {
                // start dragging
                me.elm.after(me.placeholder);       // insert placeholder
                document.body.appendChild(me.elm);  // move elm to body
                me.elm.style.position = "absolute";
                me.dragging = true;
                
                // prevent iFrames from stealing pointer events
                var frames = document.getElementsByTagName('iframe');
                for (var i = 0; i < frames.length; i++) {
                    frames[i].style.pointerEvents = "none";
                }

                // callback
                me.handlers.onStart(me, me.pointer.x, me.pointer.y);
            }

            // update pointer
            me.pointer = (e.type == 'mousemove')
                ? { x: e.pageX, y: e.pageY }
                : copyTouch(e.targetTouches[0]);

            e.preventDefault();
            e.stopPropagation();

            // update element position
            me.updatePosition();

            // callback
            me.handlers.onMove(me, me.pointer.x, me.pointer.y);
        }

        endHandle(e) {
            var me = this;

            // remove event listeners
            if (e.type === 'mouseup') {
                window.removeEventListener('mousemove', me.moveHandler);
                window.removeEventListener('mouseup', me.endHandler);
            } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
                me.handle.removeEventListener('touchmove', me.moveHandler);
                me.handle.removeEventListener('touchend', me.endHandler);
                me.handle.removeEventListener('touchcancel', me.endHandler);
            } else {
                return;
            }

            // restore state
            me.placeholder.after(me.elm);
            me.placeholder.remove();
            me.elm.style.position = "";

            // callback
            me.handlers.onEnd(me);

            // cleanup
            me.dragging = false;
            // allow iframes to steal pointer events again
            var frames = document.getElementsByTagName('iframe');
            for (var i = 0; i < frames.length; i++) {
                frames[i].style.pointerEvents = "auto";
            }
        }

        updatePosition() {
            this.elm.style.left = this.initial_offset.x + this.pointer.x + 'px';
            this.elm.style.top = this.initial_offset.y + this.pointer.y + 'px';
        }
    }

    return Draggable;
}));