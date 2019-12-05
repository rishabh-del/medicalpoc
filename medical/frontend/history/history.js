



angular.module('myApp.history', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular.filter'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/history', {
            templateUrl: 'history/history.html',
            controller: 'historyActCtrl'
        });
    }])
    .controller('historyActCtrl', ['$http', '$scope', 'myService', '$window', function ($http, $scope, myService, $window) {

        $scope.allFiles = [];
        $scope.tabPossible = true;

        $scope.currentHistory = function (patient) {
            console.log(patient);
            $http.post('/medicalHistory', patient).then(function (response) {
                $scope.userDetail = response.data;
                $scope.allFiles[0] = $scope.userDetail;
                console.log($scope.userDetail);
            });
        }

        $scope.allHistory = function (patient) {
           
            $http.post('/allmedicalHistory', patient).then(function (response) {
                console.log(response.data[0].Record);
                for(var i = 0; i < response.data.length;i++){
                    $scope.allFiles[i] = response.data[i].Record;

                }
                $scope.userDetail = response.data[0].Record;

                console.log($scope.userDetail);
            });
        }


        if (myService.get() != undefined) {
            $scope.prescript = myService.get();
            console.log($scope.prescript);
        } else {
            alert("No Report Found!");
        }


        $scope.downloadFile = async function () {
            
            for(var i = 0; i < $scope.allFiles.length;i++){
                console.log($scope.allFiles[i]);
           await $http.post('/downloadReport', $scope.allFiles[i]).then(function (response) {
                $scope.file = response.data;
                console.log($scope.file);
        
                let pdfWindow = window.open("");
                pdfWindow.document.write("<iframe width='100%' height='100%' src='" + encodeURI($scope.file) + "'></iframe>")

                //console.log(req);
            });
        }
        }





    }]);