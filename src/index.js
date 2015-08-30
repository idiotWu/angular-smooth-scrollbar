import { SmoothScrollbar } from './smooth_scrollbar';

import './apis/index';
import './events/index';
import './internals/index';

angular.module('SmoothScrollbar', [])
    .service('ScrollbarService', class ScrollbarService{
        constructor() {
            this.scrollbarInstances = {};
            this.deferreds = {};
        }

        /**
         * @method
         * Get scrollbar instance
         * If instance isn't existed,
         * callback wiil be invoked after instance is created
         *
         * @param {String} name: scrollbar name
         * @param {Function} fn: callback with instance
         */
        getInstance(name, cb) {
            if (typeof cb !== 'function') return;

            let { scrollbarInstances, deferreds } = this;

            // execute async to avoid `destroy` executed after `get`
            setTimeout(() => {
                if (scrollbarInstances.hasOwnProperty(name)) {
                    return cb(scrollbarInstances[name]);
                }

                deferreds[name] = deferreds[name] || [];
                deferreds[name].push(cb);
            });
        }

        /**
         * @method
         * Create scrollbar instance
         *
         * @param {String} name: scrollbar name
         * @param {Element} elem: container element
         * @param {Object} options: as is explained in scrollbar constructor
         */
        createInstance(name, elem, options) {
            let { scrollbarInstances, deferreds } = this;

            if (scrollbarInstances.hasOwnProperty(name)) {
                return scrollbarInstances[name];
            }

            let instance = scrollbarInstances[name] = new SmoothScrollbar(elem, options);

            if (deferreds.hasOwnProperty(name)) {
                // invoke delaied callbacks
                deferreds[name].forEach((cb) => {
                    setTimeout(() => cb(instance));
                });

                delete deferreds[name];
            }
        }

        /**
         * @method
         * Destroy scrollbar instance
         *
         * @param {String} name: scrollbar name
         */
        destroyInstance(name) {
            let { scrollbarInstances } = this;
            let instance = scrollbarInstances[name];

            if (instance) {
                instance.destroy();
                delete scrollbarInstances[name];
            }
        }
    })
    .directive('scrollbar', ['ScrollbarService', (ScrollbarService) => {
        return {
            restrict: 'AE',
            transclude: true,
            template: `
                <article class="scroll-content" ng-transclude></article>
                <aside class="scrollbar-track scrollbar-track-x">
                    <div class="scrollbar-thumb scrollbar-thumb-x"></div>
                </aside>
                <aside class="scrollbar-track scrollbar-track-y">
                    <div class="scrollbar-thumb scrollbar-thumb-y"></div>
                </aside>
            `,
            scope: {
                name: '@scrollbar',
                speed: '@',
                stepLength: '@',
                easingDuration: '@',
                easingCurve: '@'
            },
            link(scope, elem) {
                let { name, speed, stepLength, easingDuration, easingCurve } = scope;
                if (!name) throw new Error('scrollbar name is required');

                // rebuild instance
                ScrollbarService.destroyInstance(scope.name);

                ScrollbarService.createInstance(name, elem[0], {
                    speed,
                    stepLength,
                    easingDuration,
                    easingCurve
                });
            }
        };
    }]);