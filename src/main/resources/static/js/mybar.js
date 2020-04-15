
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
            if($scope.events[i].event_time===null || $scope.events[i].event_time === ''){
                $scope.events[i].event_time_string = getEventTimeStringByDateTime($scope.events[i].date_event, false);
            }else{
                $scope.events[i].event_time_string = getEventTimeStringByDateTime($scope.events[i].event_time, true);
            }
        }

    });
    $http.get('todolist/clearevents').then(function (data) {
        $scope.clearEvents = data.data;
    });

    $scope.getEventTimeClass = function(day){
        var className = 'todo_event_time';
        var diffDay = new Date().getDate()- new Date(day).getDate();
        if(diffDay>0){
            className = 'todo_event_time before';
        }else if(diffDay<0){
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
        modalInstance.calendarAppScope = angular.element(document.querySelector('[ng-app=calendar]')).scope().$$childHead.$$childHead;
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
    $scope.isLoadCompleted = false;
    $scope.isUpdated = false;
    $scope.show = function(){
        var posX = $uibModalInstance.positionX;
        var posY =  $uibModalInstance.positionY;
        var width = $uibModalInstance.width;
        $scope.event = $uibModalInstance.eventInfo;
        $scope.setEventPoint();
        var elem = document.getElementById('modal_event_content');

        if(posX * 2> $(document).width()+200){
            elem.style.marginLeft= posX-(405)+'px';
        }else{
            elem.style.marginLeft= posX+'px';
        }
        elem.style.marginTop = posY+'px';
        if($scope.event.event_time!=null){
            $scope.event.event_time_temp = new Date($scope.event.event_time);
            $scope.event.isAllDay = false;
        }else{
            $scope.event.event_time_temp = new Date($scope.event.date_event);
            $scope.event.isAllDay = true;
        }
        $scope.isLoadCompleted = true;
    };

    $scope.$watch('event ', function (newValue, oldValue) {
        if($scope.isLoadCompleted){
            if(newValue!==oldValue && !$scope.isUpdated ){
                $scope.isUpdated = true;
            }
        }
    }, true);
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

                // 스케쥴페이지 갱신
                var items = $uibModalInstance.calendarAppScope.eventList;
                for(var i = 0; i < items.length; i++){
                    if(items[i].id===$scope.event.id){
                        items.splice(i,1);
                        $uibModalInstance.calendarAppScope.moveDayEvent($scope.event.date_event,$scope.event.date_event);
                        break;
                    }
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
               event_time: $scope.event.isAllDay ? null : $scope.event.event_time_temp.yyyyMMddHHmmss(),
               title: $scope.event.title,
               event_description: $scope.event.event_description,
               event_type: $scope.event.event_type,
               event_state: $scope.event.event_state,
               event_point: $scope.event.event_point
           }
        }).then(function successCallback(response){
            console.log('success update -> ' + response.data);
            var beforeDateEvent = $scope.event.date_event;
            var afterDateEvent = $scope.event.event_time_temp.yyyyMMddHHmmss();
            $scope.event.date_event = afterDateEvent.substring(0,10);
            $scope.event.event_time = $scope.event.isAllDay ? null : afterDateEvent;
            
            // 할일 목록창 갱신
            if($scope.event.event_time==null){
                $scope.event.event_time_string = getEventTimeStringByDateTime($scope.event.date_event, false);
            }else{
                $scope.event.event_time_string = getEventTimeStringByDateTime($scope.event.event_time, true);
            }

            // 스케쥴페이지에서 이벤트의 위치를 옮김
            var items = $uibModalInstance.calendarAppScope.eventList;
            for(var i = 0; i < items.length; i++){
                if(items[i].id===$scope.event.id){
                    items[i].date_event = $scope.event.date_event;
                    items[i].title = $scope.event.title;
                    items[i].event_description = $scope.event.event_description;
                    $uibModalInstance.calendarAppScope.moveDayEvent(beforeDateEvent,afterDateEvent.substring(0,10));
                    break;
                }
            }
            alert('성공적으로 변경된 사항이 저장되었습니다.');
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

    $scope.setEventPoint = function(){
        switch ($scope.event.event_point) {
            case 0:
                $scope.event_point_text = '매우 낮음';
                break;
            case 1:
                $scope.event_point_text = '낮음';
                break;
            case 2:
                $scope.event_point_text = '보통';
                break;
            case 3:
                $scope.event_point_text = '중요';
                break;
            case 4:
                $scope.event_point_text = '매우 중요';
                break;
        }
    }
});

function getEventTimeStringByDateTime(datetime, isTargetTime){
    var diffday = new Date().getDate() - new Date(datetime).getDate();

    if(diffday===0){
        diffday = '오늘';
    }else if(diffday===1){
        diffday = '어제';
    }else if(diffday===-1){
        diffday = '내일';
    }else if(diffday>=2){
        diffday = diffday + '일 전';
    }else if(diffday<-1){
        diffday = diffday*-1 + '일 후';
    }
    return isTargetTime ? diffday + " " + datetime.substring(11,16) : diffday;
}


angular.bootstrap(document.getElementById('mybar'), ['BarApp']);