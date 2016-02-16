angular.module('SmoothScrollbar', [])
    .constant('SCROLLBAR_VERSION', Scrollbar.version)
    .service('ScrollbarService', class ScrollbarService{
        static $inject = ['$q'];

        constructor($q) {
            this.scrollbarInstances = {};
            this.deferreds = {};
            this.$q = $q;
        }

        /**
         * @method
         * Generate a scrollbar name with timestamp
         *
         * @return {String}
         */
        generateName() {
            return Date.now().toString(32);
        }

        /**
         * @method
         * Get scrollbar instance
         * If instance isn't existed,
         * callback wiil be invoked after instance is created
         *
         * @param {String} name: scrollbar name
         *
         * @return {Promise} resolved with scrollbar<Scrollbar>
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

            let instance = scrollbarInstances[name] = Scrollbar.init(elem, options);

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
            scope: {
                speed: '@',
                stepLength: '@',
                easingDuration: '@',
                easingCurve: '@',
                propagation: '='
            },
            link(scope, elem, attrs, ctrl, transclude) {
                const { speed, stepLength, easingDuration, easingCurve } = scope;
                const name = attrs.scrollbar || attrs.name || ScrollbarService.generateName();

                const scrollbar = ScrollbarService.createInstance(name, elem[0], scope);

                let original = {
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

                const $scrollContent = angular.element(scrollbar.targets.content);

                transclude((clones) => {
                    $scrollContent.append(clones);
                }, $scrollContent);
            }
        };
    }]);