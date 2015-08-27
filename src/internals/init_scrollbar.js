/**
 * @module
 * @prototype
 * @dependencies [ SmoothScrollbar, '../events' ]
 */

import '../events/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

// is standard `wheel` event supported check
const WHEEL_EVENT = 'onwheel' in window ? 'wheel' : 'mousewheel';

/**
 * @method
 * @internal
 * initialize scrollbar
 *
 * This method will attach several listeners to elements
 * and create a destroy method to remove listeners
 *
 * @param {Object} option: as is explained in constructor
 */
 let __initScrollbar = function(options) {
     this.update(); // initialize thumb position

     let container = this.target.container;
     let wheelHandler = this.__wheelHandler(options);
     let keyboardHandler = this.__keyboardHandler(options);
     let touchHandlers = this.__touchHandlers(options);
     let mouseHandlers = this.__mouseHandlers(options);
     let resizeHandler = this.__updateThrottle;

     container.addEventListener(WHEEL_EVENT, wheelHandler);

     container.addEventListener('touchstart', touchHandlers.start);
     container.addEventListener('touchmove', touchHandlers.move);
     container.addEventListener('touchend', touchHandlers.end);

     // init drag and click on scrollbar track
     container.addEventListener('click', mouseHandlers.click);
     container.addEventListener('mousedown', mouseHandlers.down);
     window.addEventListener('mousemove', mouseHandlers.move);
     window.addEventListener('mouseup', mouseHandlers.up);

     window.addEventListener('keydown', keyboardHandler);

     // release mousemove spy on window lost focus
     window.addEventListener('blur', mouseHandlers.up);
     // update on resize
     window.addEventListener('resize', resizeHandler);

     this.destroy = () => {
         container.removeEventListener(WHEEL_EVENT, wheelHandler);
         container.removeEventListener('touchstart', touchHandlers.start);
         container.removeEventListener('touchmove', touchHandlers.move);
         container.removeEventListener('touchend', touchHandlers.end);
         container.removeEventListener('click', mouseHandlers.click);
         container.removeEventListener('mousedown', mouseHandlers.down);

         window.removeEventListener('keydown', keyboardHandler);
         window.removeEventListener('mousemove', mouseHandlers.move);
         window.removeEventListener('mouseup', mouseHandlers.up);
         window.removeEventListener('blur', mouseHandlers.up);
         window.removeEventListener('resize', resizeHandler);
     };
 };

Object.defineProperty(SmoothScrollbar.prototype, '__initScrollbar', {
    value: __initScrollbar,
    writable: true,
    configurable: true
});
