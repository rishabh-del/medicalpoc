'use strict';



angular.module('myApp.landing', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular.filter'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/landing', {
            templateUrl: 'landing/landing.html',
            controller: 'landingActCtrl'
        });
    }])
    .controller('landingActCtrl', ['$http', '$scope', 'myService', function ($http, $scope, myService) {
       
        $scope.tabPossible = true;
        
        $scope.prescription = function(user){
            console.warn(user.patientKey);
            console.log(user);
            myService.set(user);
            $scope.loader = true;
            $http.post('/createMedicalDoc', user).then(function (response, error){
              console.log(response);
              $scope.loader = false;
               alert(response.data);
               
            });
        }



    }]).directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);