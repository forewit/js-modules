

let root = document.documentElement;
let body = document.body;

let sar, sal, sat, sab;


// handle gesture resize
function resizeHandler(e) {
    sar = getComputedStyle(root).getPropertyValue('--sar');
    sal = getComputedStyle(root).getPropertyValue('--sal');
    sat = getComputedStyle(root).getPropertyValue('--sat');
    sab = getComputedStyle(root).getPropertyValue('--sab');

    root.style.setProperty('--window-width', `${window.innerWidth}px`);
    root.style.setProperty('--window-height', `${window.innerHeight}px`);
}
//root.addEventListener("resize", resizeHandler);
//resizeHandler();

