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

    const MIN_SEPARATION = 50;
    const RADIUS = 15;

    let dist = function (x1, y1, x2, y2) {
        var a = x2 - x1;
        var b = y2 - y1;
        return Math.sqrt(a * a + b * b);
    }

    class Pen {
        constructor(element) {
            var me = this;

            // Attributes
            me.points = [];
            me.elm = element;
            me.ctx = me.elm.getContext("2d");
            me.gestures = new Gestures(me.elm);
            me.rect = me.elm.getBoundingClientRect();

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

            // ensure minimum separation between the last point and the new one
            if (me.points.length > 0) {
                let lastPoint = me.points[me.points.length - 1];

                var distance = dist(point.x, point.y, lastPoint.x, lastPoint.y);

                if (distance >= RADIUS) {
                    // see: https://math.stackexchange.com/questions/127613/closest-point-on-circle-edge-from-point-outside-inside-the-circle
                    // A = point
                    // B = lastPoint
                    // r = RADIUS
                    let denominator = Math.sqrt(point.x * point.x + point.y * point.y - 2 * point.x * lastPoint.x + lastPoint.x * lastPoint.x - 2 * point.y * lastPoint.y + lastPoint.y * lastPoint.y)
                    let newPoint = {
                        x: point.x + RADIUS * ((lastPoint.x - point.x) / denominator),
                        y: point.y + RADIUS * ((lastPoint.y - point.y) / denominator)
                    }

                    me.points.push(newPoint);
                }
            } else {
                me.points.push({ x: point.x, y: point.y });
            }
        }

        resize() {
            // recalculate canvas size
            this.rect = this.elm.getBoundingClientRect();

            this.ctx.resetTransform()
            this.ctx.canvas.width = this.rect.width;
            this.ctx.canvas.height = this.rect.height;
        }

        render() {
            var me = this;

            if (me.points.length == 0) return;

            // clear context
            me.ctx.clearRect(0, 0, me.rect.width, me.rect.height);
            me.ctx.beginPath();

            // draw circle around the last point
            me.ctx.arc(me.points[me.points.length - 1].x, me.points[me.points.length - 1].y, RADIUS, 0, 2 * Math.PI);


            // draw curves between all points
            if (me.points.length > 2) {
                // move to the first point
                me.ctx.moveTo(me.points[0].x, me.points[0].y);
                for (var i = 1; i < me.points.length - 2; i++) {
                    var xc = (me.points[i].x + me.points[i + 1].x) / 2;
                    var yc = (me.points[i].y + me.points[i + 1].y) / 2;
                    me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, xc, yc);
                }

                // curve through the last two points
                me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, me.points[i + 1].x, me.points[i + 1].y);
            }

            me.ctx.stroke();
            //console.log("hi");
        }
    }

    return Pen;
}));