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
    $scope.init = function(){
        // 테마 토글 버튼
        var toggleTheme = getCookie('toggleTheme');
        if(toggleTheme==null || toggleTheme=='false'){
            $("input:checkbox[id='tgl1']").prop("checked", false);
        }else{
            $("input:checkbox[id='tgl1']").prop("checked", true);
        }

        // 메모 색상 옵션
        var memoColor = getCookie('memoColor');
        if(memoColor!=null && memoColor!=''){
            for(var i = 0; i < $scope.optionsMemoColor.length; i++){
                if($scope.optionsMemoColor[i]["code"]===memoColor){
                    $scope.selectedMemoColor = $scope.optionsMemoColor[i];
                    break;
                }
            }
        }

        // 메모 크기 옵션
        var memoSize = getCookie('memoSize');
        if(memoSize!=null && memoSize!=''){
            for(var i = 0; i < $scope.optionsMemoSize.length; i++){
                if($scope.optionsMemoSize[i]["code"]===memoSize){
                    $scope.selectedMemoSize = $scope.optionsMemoSize[i];
                    break;
                }
            }
        }

        // 메모 폰트 크기 옵션
        var memoFontSize = getCookie('memoFontSize');
        if(memoFontSize!=null && memoFontSize!=''){
            for(var i = 0; i < $scope.optionsMemoFontSize.length; i++){
                if($scope.optionsMemoFontSize[i]["code"]===memoFontSize){
                    $scope.selectedMemoFontSize = $scope.optionsMemoFontSize[i];
                    break;
                }
            }
        }
    }
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

    $scope.setThemeToggle = function(){
        var toggleTheme = getCookie('toggleTheme');
        if(toggleTheme==null || toggleTheme=='false'){
            $("input:checkbox[id='tgl1']").prop("checked", true);
            $('body').addClass("dark");
            setCookie('toggleTheme', true, 7);
        }else{
            $("input:checkbox[id='tgl1']").prop("checked", false);
            $('body').removeClass("dark");
            setCookie('toggleTheme', false, 7);
        }
    }

    $scope.optionsMemoColor = [
        {code:'',name:'기본색'},
        {code:'white',name:'밝은색'},
        {code:'blue',name:'푸른색'},
        {code:'dark',name:'어두운색'}
    ];

    $scope.selectedMemoColor = $scope.optionsMemoColor[0];

    $scope.onChangeMemoColor = function(){
        setCookie('memoColor', $scope.selectedMemoColor.code, 7);
    }

    $scope.optionsMemoSize = [
        {code:'',name:'중간(기본)'},
        {code:'small',name:'작게'},
        {code:'big',name:'크게'}
    ];

    $scope.selectedMemoSize = $scope.optionsMemoSize[0];

    $scope.onChangeMemoSize = function(){
        setCookie('memoSize', $scope.selectedMemoSize.code, 7);
    }

    $scope.optionsMemoFontSize = [
        {code:'',name:'중간(기본)'},
        {code:'smallFont',name:'작게'},
        {code:'bigFont',name:'크게'}
    ];

    $scope.selectedMemoFontSize = $scope.optionsMemoFontSize[0];

    $scope.onChangeMemoFontSize = function(){
        setCookie('memoFontSize', $scope.selectedMemoFontSize.code, 7);
    }
});