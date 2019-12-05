'use strict';



angular.module('myApp.signup', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular.filter'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/signup', {
            templateUrl: 'signup/signup.html',
            controller: 'signupActCtrl'
        });
    }])
    .controller('signupActCtrl', ['$http', '$scope', function ($http, $scope) {
        // intial data table load start
        $scope.tabPossible = false;

        $scope.signUpData = function (user) {
            console.log(user);
            if (user.email && user.password && user.userType != null) {
               if(user.password == user.passRepeat){
                $http.post('/signup', user).then(function (res, err) {
                    
                    console.log("got signup response as : ",err, res);
                  
                        window.location.href = 'hom.html#!/login';
                   

                }).catch(function (err){
                    alert(err.data);
                });
            } else {
                alert("Both password should match!");
            }
        }else{
            alert("All fields are mandatory!");

        }
        }


    }]);