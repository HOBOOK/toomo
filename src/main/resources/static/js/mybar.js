
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


});

barApp.controller('ModalContentCtrl', function($scope, $uibModalInstance, $http) {
    $scope.event = {};
    $scope.show = function(){
        var posX = $uibModalInstance.positionX;
        var posY =  $uibModalInstance.positionY;
        var width = $uibModalInstance.width;
        $scope.event = $uibModalInstance.eventInfo;
        var elem = document.getElementById('modal_event_content');

        if(posX * 2> $(document).width()+200){
            elem.style.marginLeft= posX-(405)+'px';
        }else{
            elem.style.marginLeft= posX+'px';
        }
        elem.style.marginTop = posY+'px';
        if($scope.event.event_time!=null){
            $scope.event.event_time_temp = new Date($scope.event.event_time);
        }else{
            $scope.event.event_time_temp = new Date($scope.event.date_event);
        }
    };
    $scope.removeEvent = function(){
        if(confirm("일정을 삭제하시겠습니까?")){
            $http({
                method: 'DELETE',
                url: 'schedule/delete',
                params: {id:$scope.event.id},
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function successCallback(response){
                if($scope.event.event_state==0){
                    $uibModalInstance.parent.events.splice($uibModalInstance.parent.events.indexOf($uibModalInstance.eventInfo),1);
                }else{
                    $uibModalInstance.parent.clearEvents.splice($uibModalInstance.parent.clearEvents.indexOf($uibModalInstance.eventInfo),1);
                }
                $scope.close();
            }, function errorCallback(response){
                console.log('error delete -> ' +response);
            });
        }
    }
    $scope.saveEvent = function(){
        $http({
           method: 'PUT',
           url: 'schedule/create',
           data: {
               id: $scope.event.id,
               date_event: $scope.event.event_time_temp.yyyyMMddHHmmss().substring(0,10),
               event_time: $scope.event.event_time_temp.yyyyMMddHHmmss(),
               title: $scope.event.title,
               event_description: $scope.event.event_description,
               event_type: $scope.event.event_type,
               event_state: $scope.event.event_state
           }
        }).then(function successCallback(response){
            console.log('success update -> ' + response.data);
            var beforeDateEvent = $scope.event.date_event;
            var afterDateEvent = $scope.event.event_time_temp.yyyyMMddHHmmss();
            $scope.event.date_event = afterDateEvent.substring(0,10);
            $scope.event.event_time = afterDateEvent;
            
            // 할일 목록창 갱신
            $uibModalInstance.eventInfo = $scope.event;
            $uibModalInstance.eventInfo.diff_day = getDiffDay($scope.event.event_time);
            $uibModalInstance.eventInfo.event_time_string = getEventTimeStringByDateTime($scope.event.event_time, $uibModalInstance.eventInfo.diff_day);
            
            // 스케쥴페이지에서 이벤트의 위치를 옮김
            var calAppScope = angular.element(document.querySelector('[ng-app=calendar]')).scope().$$childHead.$$childHead;
            if(calAppScope==null)
                return;
            var items = calAppScope.eventList;
            for(var i = 0; i < items.length; i++){
                if(items[i].id===$scope.event.id){
                    items[i].date_event = $scope.event.date_event;
                    calAppScope.moveDayEvent(beforeDateEvent,afterDateEvent.substring(0,10));
                    break;
                }
            }
        }, function errorCallback(response){
            console.log('error dupdate -> ' +response);
        });
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

angular.bootstrap(document.getElementById('mybar'), ['BarApp']);