(function(angular) {
    'use strict';

    var app = angular.module('demo', ['SmoothScrollbar']);

    app.controller('GetDataCtrl', function($scope, ScrollbarService) {
        $scope.offset = {
            x: 0,
            y: 0
        };
        $scope.limit = {
            x: 0,
            y: 0
        };
        $scope.velocity = {
            x: 0,
            y: 0
        };

        $scope.loading = 'pending...';
        var paragraphTmpl = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam, accusamus laudantium nostrum minima possimus optio voluptates id dignissimos, libero voluptas nesciunt. Consequatur deleniti corporis recusandae nesciunt. Maiores dignissimos praesentium tempore.';
        var article = $scope.article = [paragraphTmpl];

        var lastTime, mustRun;

        ScrollbarService.getInstance('getData', function(scrollbar) {
            console.log(scrollbar)
            $scope.offset = scrollbar.offset;
            $scope.$apply();

            scrollbar.addListener(function(status) {
                var now = (new Date()).getTime();
                lastTime = lastTime || now;

                clearTimeout(mustRun);

                mustRun = setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.offset = status.offset;
                        $scope.velocity = status.velocity;
                    });
                }, 300);

                if (now - lastTime < 300) return;

                lastTime = now;
                $scope.$apply(function() {
                    $scope.offset = status.offset;
                    $scope.velocity = status.velocity;
                });
            });

            var count = 0;
            scrollbar.infiniteScroll(function() {
                if (count++ > 10) {
                    $scope.loading = 'the end';
                    return;
                }

                $scope.$apply(function() {
                    $scope.loading = 'loading...';
                    setTimeout(function() {
                        $scope.loading = 'pending...';
                        article.push(paragraphTmpl);
                        article.push(paragraphTmpl);
                        $scope.$apply();
                        scrollbar.update();
                    }, 500);
                });
            });
        });
    });
})(angular);
