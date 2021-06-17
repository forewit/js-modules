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
    const CIRCLE_SIZE = 15;

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
            me.gestures.on('mouseDragStart', () => { me.points = []; });
            me.gestures.on('mouseDragging', me.dragHandler);
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
                let lastPoint = me.points[me.points.length-1];

                var a = point.x - lastPoint.x;
                var b = point.y - lastPoint.y;

                var distance = Math.sqrt(a * a + b * b);

                if (distance >= MIN_SEPARATION) me.points.push({ x: point.x, y: point.y });
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

            if (me.points.length < 3) return;

            // clear context
            me.ctx.clearRect(0, 0, me.rect.width, me.rect.height);
            me.ctx.beginPath();

            // move to the first point
            me.ctx.moveTo(me.points[0].x, me.points[0].y);

            for (var i = 1; i < me.points.length - 2; i++) {
                var xc = (me.points[i].x + me.points[i + 1].x) / 2;
                var yc = (me.points[i].y + me.points[i + 1].y) / 2;
                me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, xc, yc);
            }

            // curve through the last two points
            me.ctx.quadraticCurveTo(me.points[i].x, me.points[i].y, me.points[i + 1].x, me.points[i + 1].y);

            me.ctx.stroke();
            //console.log("hi");
        }
    }

    return Pen;
}));