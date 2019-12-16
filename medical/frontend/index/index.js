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

        $scope.addOrg = function () {
           // console.log(user);
            var orgDetail = {
                orgname : "org4",
                chaincodeversion : "3.0"
            }
            $http.post('/addOrg',orgDetail).then(function (res) {
               console.log("add org res", res);
              // $scope.getResponse = true;
              
                  alert("New organization added");
              
            }).catch(function (err) {
                alert(err.data);
            });
        }
    }]);