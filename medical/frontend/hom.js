'use strict';

// Declare app level module which depends on views, and core components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.signup',
  'myApp.landing',
  'myApp.history',
  'myApp.landing',
  'myApp.index'
]).
  config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({ redirectTo: '/index' });

  }]);

myApp.controller('homeController', function ($http, $scope) {
 
  $scope.logout = function(){
    console.log("in");
    window.location.href = 'hom.html';
  }

  console.log(document.URL);
  console.log(document.namespaceURI);


});