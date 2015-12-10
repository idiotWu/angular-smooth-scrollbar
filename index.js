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
         */
        getInstance(name) {
            const { scrollbarInstances, deferreds, $q } = this;

            if (scrollbarInstances.hasOwnProperty(name)) {
                return ($q.resolve || $q.when)(scrollbarInstances[name]);
            }

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
            const { scrollbarInstances, deferreds } = this;

            if (scrollbarInstances.hasOwnProperty(name)) {
                return scrollbarInstances[name];
            }

            let instance = scrollbarInstances[name] = new Scrollbar(elem, options);

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
                speed: '@',
                stepLength: '@',
                easingDuration: '@',
                easingCurve: '@'
            },
            link(scope, elem, attrs) {
                const { speed, stepLength, easingDuration, easingCurve } = scope;
                const name = attrs.scrollbar || attrs.name || Date.now().toString(32);

                let scrollbar = ScrollbarService.createInstance(name, elem[0], {
                    speed,
                    stepLength,
                    easingDuration,
                    easingCurve
                });

                let original = {
                    update: ::scrollbar.update,
                    scrollTo: ::scrollbar.scrollTo,
                    addListener: ::scrollbar.addListener,
                    infiniteScroll: ::scrollbar.infiniteScroll
                };

                let applyChange = (cb) => {
                    if (typeof cb !== 'function') return;

                    return (...args) => {
                        cb(...args);
                        scope.$apply();
                    };
                };

                scrollbar.update = (cb) => {
                    original.update(applyChange(cb));
                };

                scrollbar.scrollTo = (x, y, duration, cb) => {
                    original.scrollTo(x, y, duration, applyChange(cb));
                };

                scrollbar.addListener = (cb) => {
                    if (typeof cb !== 'function') return;

                    original.addListener(applyChange(cb));
                };

                scrollbar.infiniteScroll = (cb, threshold) => {
                    if (typeof cb !== 'function') return;

                    original.infiniteScroll(applyChange(cb), threshold);
                };

                scope.$on('$destroy', () => {
                    ScrollbarService.destroyInstance(name);
                });
            }
        };
    }]);