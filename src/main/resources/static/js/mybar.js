
var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var barApp = angular.module('BarApp', ['ngAnimate', 'ui.bootstrap']);

barApp.config(['$qProvider','$httpProvider', function($qProvider, $httpProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common[header] = token;
}]);
barApp.controller('barController', function ($scope, $http, $uibModal) {
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

    $scope.clearEvent = function($index){
        var e = $scope.events[$index];
        $scope.clearEvents.push(e);
        $scope.events.splice($index, 1);

    };

    $scope.summaryEvent = function(){

    };

    $scope.select = function(event, $event) {
        var modalInstance = $uibModal.open({
            templateUrl: "modal/modal_event",
            controller: "ModalContentCtrl",
            size: ''
        });
        modalInstance.positionX = $event.currentTarget.getBoundingClientRect().x;
        modalInstance.positionY = $event.currentTarget.getBoundingClientRect().y;
        modalInstance.width = $event.currentTarget.clientWidth;
        modalInstance.parent = $scope;
        modalInstance.eventInfo = event;
        modalInstance.result.then(function (response) {
            $scope.result = '${response} button hitted';
        });
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

barApp.controller('ModalContentCtrl', function($scope, $uibModalInstance, $http) {
    $scope.show = function(){
        var posX = $uibModalInstance.positionX;
        var posY =  $uibModalInstance.positionY;
        var width = $uibModalInstance.width;
        var elem = document.getElementById('modal_event_content');

        if(posX * 2> $(document).width()+200){
            elem.style.marginLeft= posX-(405)+'px';
        }else{
            elem.style.marginLeft= posX+'px';
        }
        elem.style.marginTop = posY+'px';
    };
    $scope.removeEvent = function($index, target){
        if(confirm("선택한 일정을 삭제하시겠습니까?")){
            $http({
                method: 'DELETE',
                url: 'schedule/delete',
                params: {id:target.id},
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function successCallback(response){
                console.log(response);
            }, function errorCallback(response){
                console.log('error delete -> ' +response);
            });
        }
    }
    $scope.ok = function(){
        $uibModalInstance.close("Ok");
    }
    $scope.cancel = function(){
        $scope.close();
    }
    $scope.cancelOutside = function($event){
        if($event.target==$event.currentTarget){
            $scope.close();
        }
    }
    $scope.close = function(){
        var elem = document.getElementById('modal_event_content');
        elem.style.animationName='animateFadeHide';
        elem.style.opacity='0';
        setTimeout(function() {
            $uibModalInstance.dismiss();
        }, 250);
    }
});

angular.bootstrap(document.getElementById('mybar'), ['BarApp']);