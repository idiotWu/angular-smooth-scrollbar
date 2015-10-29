import { SmoothScrollbar } from './smooth_scrollbar';

import './apis/index';
import './events/index';
import './internals/index';

angular.module('SmoothScrollbar', [])
    .service('ScrollbarService', class ScrollbarService{
        static $inject = ['$q'];

        constructor($q) {
            this.scrollbarInstances = {};
            this.deferreds = {};
            this.$q = $q;
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
        getInstance(name) {
            let { deferreds, $q } = this;

            let deferred = deferreds[name] = deferreds[name] || $q.defer();

            return deferred.promise;
        }

        /**
         * @method
         * Create scrollbar instance
         *
         * @param {String} name: scrollbar name
         * @param {Element} elem: container element
         * @param {Object} options: as is explained in scrollbar constructor
         *
         * @return {Scrollbar} scrollbar instance
         */
        createInstance(name, elem, options) {
            let { scrollbarInstances, deferreds } = this;

            if (scrollbarInstances.hasOwnProperty(name)) {
                return scrollbarInstances[name];
            }

            let instance = scrollbarInstances[name] = new SmoothScrollbar(elem, options);

            if (deferreds.hasOwnProperty(name)) {
                deferreds[name].resolve(instance);
            }

            return instance;
        }

        /**
         * @method
         * Destroy scrollbar instance
         *
         * @param {String} name: scrollbar name
         */
        destroyInstance(name) {
            let { scrollbarInstances, deferreds } = this;
            let instance = scrollbarInstances[name];

            if (instance) {
                instance.destroy();
                delete scrollbarInstances[name];
                delete deferreds[name];
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

                let scrollbar = ScrollbarService.createInstance(name, elem[0], {
                    speed,
                    stepLength,
                    easingDuration,
                    easingCurve
                });

                let originalFn = scrollbar.addListener;

                scrollbar.addListener = (cb) => {
                    if (typeof cb !== 'function') return;

                    originalFn.call(scrollbar, (...args) => {
                        cb(...args);
                        scope.$apply();
                    });
                };

                scope.$on('$destroy', () => {
                    ScrollbarService.destroyInstance(name);
                });
            }
        };
    }]);