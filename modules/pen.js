// Requires Gestures.js

const Gestures = require("./Gestures");


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

    class Pen {
        constructor (element) {
            var me = this;

            // Attributes
            me.elm = element;
            me.gestures = new Gestures(me.elm);

            // initialize
            me.gestures.on('mouseDragging', me.dragHandler)
            me.gestures.start()
        }

        dragHandler(point) {
            console.log(point);
        }
    }


    return Pen;
}));


/*
// move to the first point
ctx.moveTo(points[0].x, points[0].y);

for (i = 1; i < points.length - 2; i ++)
{
   var xc = (points[i].x + points[i + 1].x) / 2;
   var yc = (points[i].y + points[i + 1].y) / 2;
   ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
}

// curve through the last two points
ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
*/