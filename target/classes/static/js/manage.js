Date.prototype.yyyyMMddHHmmss = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]) + ' ' + (HH[1]?HH : '0'+HH[0]) + ':' + (mm[1]?mm : '0'+mm[0]) + ':'+(ss[1]?ss:'0'+ss[0])+".";
}
var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

window.FileAPI = {
    jsUrl: 'FileAPI.min.js',
    flashUrl: 'FileAPI.flash.swf'
};

var app = angular.module('ManageApp', ['ngAnimate','ngSanitize','ngFileUpload']);

app.config(['$qProvider','$httpProvider', function($qProvider, $httpProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common[header] = token;
}]);
app.controller('manageController', function ($scope, $http, $compile) {

    $scope.imageSource = "";
    $scope.imageChanged = function(element)
    {
        console.log('이미지 변경');
        var reader = new FileReader();
        reader.onload = function(e)
        {
            $scope.$apply(function()
            {
                $scope.imageSource = e.target.result;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };

    $scope.submit = function (file) {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };
    $scope.upload = function (file) {
        Upload.upload({
            url: 'upload',
            data:{
                file: file,
                email: $scope.email
            }
        }).then(function(response){
            console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
        }, function (response) {
            console.log('Error Uploard ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
        }, function(evt){
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
});