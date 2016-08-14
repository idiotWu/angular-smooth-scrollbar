angular.module('SmoothScrollbar', [])
    .constant('SCROLLBAR_VERSION', Scrollbar.version)
    .provider('ScrollbarService', function ScrollbarServiceProvider() {
        const DEFAULT_OPTIONS = {};
        const scrollbarInstances = {};
        const deferreds = {};

        this.setDefaultOptions = (opt = {}) => {
            return angular.extend(DEFAULT_OPTIONS, opt);
        };

        let id = 0;

        this.$get = ['$q', function ($q) {
            class ScrollbarService{
                constructor() {
                    this.id = 0;
                }

                /**
                 * @method
                 * Generate a scrollbar name with timestamp + id
                 *
                 * @return {String}
                 */
                generateName() {
                    this.id++;
                    return Date.now().toString(32) + '$' + this.id;
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
                    let deferred = deferreds[name] = deferreds[name] || $q.defer();

                    if (scrollbarInstances.hasOwnProperty(name)) {
                        deferred.resolve(scrollbarInstances[name]);
                    }

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
                    if (scrollbarInstances.hasOwnProperty(name)) {
                        return scrollbarInstances[name];
                    }

                    let res = {};

                    Object.keys(options).forEach((prop) => {
                        if (options[prop] !== undefined) {
                            res[prop] = options[prop];
                        }
                    });

                    let instance = scrollbarInstances[name] = Scrollbar.init(elem, {
                        ...DEFAULT_OPTIONS,
                        ...res
                    });

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
                    let instance = scrollbarInstances[name];

                    if (instance) {
                        instance.destroy(true);
                        delete scrollbarInstances[name];
                        delete deferreds[name];
                    }
                }
            }

            return new ScrollbarService();
        }];
    })
    .directive('scrollbar', ['ScrollbarService', (ScrollbarService) => {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                speed: '=',
                damping: '=',
                thumbMinSize: '=',
                syncCallbacks: '=',
                renderByPixels: '=',
                alwaysShowTracks: '=',
                continuousScrolling: '=',
                overscrollEffect: '=',
                overscrollDamping: '=',
                overscrollEffectColor: '@'
            },
            link(scope, elem, attrs, ctrl, transclude) {
                if (attrs.continuousScrolling === 'auto') {
                    scope.continuousScrolling = 'auto';
                }

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
