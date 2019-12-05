'use strict';



angular.module('myApp.login', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular.filter'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginActCtrl'
        });
    }])
    .controller('loginActCtrl', ['$http', '$scope', 'myService', function ($http, $scope, myService) {
        // intial data table load start
        $scope.tabPossible = false;

        $scope.getUser = function (user) {
            console.log(user);
            $http.post('/loginPage',user).then(function (res) {
               console.log("login res", res);
               $scope.getResponse = true;
              
                   // res.redirect('hom.html');
                   if(res.data.role != "Pharmacist"){
                       $scope.prescript = false;
                  window.location.href = 'hom.html#!/landing';
                   }else{
                    myService.set(false);
                 window.location.href = 'hom.html#!/history';
                   }
              
            }).catch(function (err) {
                alert(err.data);
            });
        }
       


    }]);