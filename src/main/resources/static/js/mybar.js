
var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var barApp = angular.module('BarApp', ['ngAnimate']);

barApp.config(['$qProvider','$httpProvider', function($qProvider, $httpProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common[header] = token;
}]);
barApp.controller('barController', function ($scope, $http) {
    $scope.events = [];
    $scope.clearEvents = [];
    $http.get('todolist/events').then(function (data) {
        $scope.events = data.data;
        for(var i = 0; i < $scope.events.length; i++){
            var eTime = $scope.events[i].event_time;
            $scope.events[i].diff_day = getDiffDay(eTime);
            $scope.events[i].event_time_string = getEventTimeStringByDateTime(eTime, $scope.events[i].diff_day);
        }
    });
    $http.get('todolist/clearevents').then(function (data) {
        $scope.clearEvents = data.data;
    });

    $scope.getEventTimeClass = function(day){
        var className = 'todo_event_time';
        if(day>0){
            className = 'todo_event_time before';
        }else if(day<0){
            className = 'todo_event_time after';
        }
        return className;
    };
    function getDiffDay(datetime){
        return new Date().getDate() - new Date(datetime).getDate();
    }
    function getEventTimeStringByDateTime(datetime, day){
        if(day===0){
            day = '오늘';
        }else if(day===1){
            day = '어제';
        }else if(day===-1){
            day = '내일';
        }else if(day>=2){
            day = day + '일전';
        }else if(day<-1){
            day = day*-1 + '일후';
        }
        var retDate = "";
        retDate += day + " " + datetime.substring(11,16);
        return retDate;
    }
});
angular.bootstrap(document.getElementById('mybar'), ['BarApp']);