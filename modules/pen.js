// Requires Gestures.js

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Pen = factory();
    }
}(this, function () {
    'use strict';

    let dist = function (x1, y1, x2, y2) {
        var a = x2 - x1;
        var b = y2 - y1;
        return Math.sqrt(a * a + b * b);
    }

    class Pen {
        constructor(element, options) {
            var me = this;
            if (!options) options = {};


            // Attributes
            me.points = [];
            me.pointer = {};
            me.height = 0;
            me.width = 0;
            me.dpi = window.devicePixelRatio;
            me.elm = element;
            me.ctx = me.elm.getContext("2d");
            me.gestures = new Gestures(me.elm);
            me.drawRadius = (options.drawRadius) ? options.drawRadius : 10;
            me.lineWidth = (options.lineWidth) ? options.lineWidth : 5;
            me.lineCap = (options.lineCap) ? options.lineCap : "round";
            me.strokeStyle = (options.strokeStyle) ? options.strokeStyle : "#000000";
            me.lineDash = (options.lineDash) ? options.lineDash : [];


            // bind handlers
            this.dragHandler = this.dragHandle.bind(this);


            // initialize 
            me.gestures.on('mouseDragStart touchDragStart', () => { me.points = []; });
            me.gestures.on('mouseDragging touchDragging', me.dragHandler);
            me.gestures.start();
            me.resize();


            // ********** render loop *************
            var FPS = 0;
            var ticks = 0;
            var lastFPS = 0;

            function loop(delta) {
                requestAnimationFrame(loop);
                var perSec = delta / 1000;

                // do stuff
                me.render();

                // FPS counter
                var now = Date.now();
                if (now - lastFPS >= 1000) {
                    lastFPS = now;
                    FPS = ticks;
                    ticks = 0;
                }
                ticks++;
            }
            requestAnimationFrame(loop);
            // ************************************
        }

        dragHandle(point) {
            var me = this;

            
            // adjust for DPI & offset
            let rect = me.elm.getBoundingClientRect();
            point.x += rect.left;
            point.y -= rect.top;
            point.x *= me.dpi;
            point.y *= me.dpi;


            me.pointer.x = point.x;
            me.pointer.y = point.y;

            // ensure minimum separation between the last point and the new one
            if (me.points.length > 0) {
                let lastPoint = me.points[me.points.length - 1];

                var distance = dist(point.x, point.y, lastPoint.x, lastPoint.y);

                if (distance >= me.drawRadius) {
                    // see: https://math.stackexchange.com/questions/127613/closest-point-on-circle-edge-from-point-outside-inside-the-circle
                    // A = point
                    // B = lastPoint
                    // r = drawRadius
                    let denominator = Math.sqrt(point.x * point.x + point.y * point.y - 2 * point.x * lastPoint.x + lastPoint.x * lastPoint.x - 2 * point.y * lastPoint.y + lastPoint.y * lastPoint.y)
                    let newPoint = {
                        x: point.x + me.drawRadius * ((lastPoint.x - point.x) / denominator),
                        y: point.y + me.drawRadius * ((lastPoint.y - point.y) / denominator)
                    }

                    // TODO: maybe remove? prevents spikes when doing sharp turns
                    if (dist(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y) <= 0.1) return;

                    me.points.push(newPoint);
                }
            } else {
                me.points.push({ x: point.x, y: point.y });
            }
        }

        resize() {
            var me = this;

            me.ctx.resetTransform()

            //get DPI
            me.dpi = window.devicePixelRatio;

            //get CSS height
            //the + prefix casts it to an integer
            //the slice method gets rid of "px"
            let style_height = +getComputedStyle(me.elm).getPropertyValue("height").slice(0, -2);
            
            //get CSS width
            let style_width = +getComputedStyle(me.elm).getPropertyValue("width").slice(0, -2);
            
            // calculate new height & width
            me.height = style_height * me.dpi;
            me.width = style_width * me.dpi;

            //scale the canvas
            me.elm.setAttribute('height', me.height);
            me.elm.setAttribute('width', me.width);
        }

        render() {
            var me = this;

            if (me.points.length == 0) return;

            // clear context
            me.ctx.clearRect(0, 0, me.width, me.height);

            // draw circle around the last point
            me.ctx.beginPath();
            me.ctx.lineWidth = 2;
            me.ctx.strokeStyle = "#2D9BF0";
            me.ctx.setLineDash([1, 3]);
            me.ctx.arc(me.points[me.points.length - 1].x, me.points[me.points.length - 1].y, me.drawRadius, 0, 2 * Math.PI);
            me.ctx.closePath();
            me.ctx.stroke();

            // draw curves between all points
            me.ctx.beginPath()
            me.ctx.lineWidth = me.lineWidth;
            me.ctx.lineCap = me.lineCap;
            me.ctx.strokeStyle = me.strokeStyle;
            me.ctx.setLineDash(me.lineDash);

            if (me.points.length > 2) {
                // move to the first point
                me.ctx.moveTo(me.points[0].x, me.points[0].y);

                // curve through the middle points
                for (var i = 1; i < me.points.length - 2; i++) {
                    var xc = (me.points[i].x + me.points[i + 1].x) / 2;
                    var yc = (me.points[i].y + me.points[i + 1].y) / 2;
                    me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, xc, yc);
                }

                // curve through the last two points
                me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, me.points[i + 1].x, me.points[i + 1].y);
            }
            me.ctx.stroke();
        }

    }

    return Pen;
}));


