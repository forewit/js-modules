

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.keys = {}));
}(this, (function (exports) {
    'use strict';



    Object.defineProperty(exports, '__esModule', { value: true });
})));

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