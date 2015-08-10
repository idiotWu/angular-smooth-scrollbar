/**
 * @module
 * @prototype
 * @dependencies [ SmoothScrollbar, '../events' ]
 */

import '../events/index';
import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };

// is `mousewheel` event supported check
const WHEEL_EVENT = 'onmousewheel' in document.documentElement ? 'mousewheel' : 'wheel';

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

     let $window = angular.element(window);
     let $container = this.$target.container;
     let wheelHandler = this.__wheelHandler(options);
     let keyboardHandler = this.__keyboardHandler(options);
     let touchHandlers = this.__touchHandlers(options);
     let mouseHandlers = this.__mouseHandlers(options);
     let resizeHandler = this.__updateThrottle;

     $container.on(WHEEL_EVENT, wheelHandler);

     $container.on('touchstart', touchHandlers.start);
     $container.on('touchmove', touchHandlers.move);
     $container.on('touchend', touchHandlers.end);

     // init drag and click on scrollbar track
     $container.on('click', mouseHandlers.click);
     $container.on('mousedown', mouseHandlers.down);
     $window.on('mousemove', mouseHandlers.move);
     $window.on('mouseup', mouseHandlers.up);

     $window.on('keydown', keyboardHandler);

     // release mousemove spy on window lost focus
     $window.on('blur', mouseHandlers.up);
     // update on resize
     $window.on('resize', resizeHandler);

     this.destroyScrollbar = () => {
         $container.off(WHEEL_EVENT, wheelHandler);
         $container.off('touchstart', touchHandlers.start);
         $container.off('touchmove', touchHandlers.move);
         $container.off('touchend', touchHandlers.end);
         $container.off('click', mouseHandlers.click);
         $container.off('mousedown', mouseHandlers.down);

         $window.off('keydown', keyboardHandler);
         $window.off('mousemove', mouseHandlers.move);
         $window.off('mouseup', mouseHandlers.up);
         $window.off('blur', mouseHandlers.up);
         $window.off('resize', resizeHandler);
     };
 };

Object.defineProperty(SmoothScrollbar.prototype, '__initScrollbar', {
    value: __initScrollbar,
    writable: true,
    configurable: true
});
