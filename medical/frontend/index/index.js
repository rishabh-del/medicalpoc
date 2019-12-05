'use strict';



angular.module('myApp.index', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular.filter'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'index/index.html',
            controller: 'indexActCtrl'
        });
    }])
    .controller('indexActCtrl', ['$http', '$scope', function ($http, $scope) {
   
        $scope.tabPossible = false;


    }]);