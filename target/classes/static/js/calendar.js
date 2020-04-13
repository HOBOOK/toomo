$(document).ready(function(){
    $('.container_main').mCustomScrollbar('destroy');
});


var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var calApp = angular.module("calendar", ['ngAnimate', 'ui.bootstrap','ngSanitize']);

calApp.config(['$qProvider','$httpProvider', function($qProvider, $httpProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common[header] = token;
}]);

calApp.controller("calendarWidget", function($scope, $http, $uibModal) {
    //calendar directive에 selected=day 로 정의를 해 둔 상태, 즉 다른 선택된 값이 없는 초기의 경우에는 selected = day 값.
    $scope.day = moment();
});

calApp.directive("calendar", function($uibModal, $http) {
    return {
        restrict: "E",
        templateUrl: "calendar",
        scope: {
            selected: "="
            // "=" : 부모 scope의 property와 디렉티브의 property를 binding하여 directive에서 부모 scope에 접근하겠다.
            // 그래서 directive는 부모 스코프인 selected객체를 그대로 접근해서 사용이 가능.
        },
        uibModal: {

        },
        link: function(scope, element) {
            scope.month = scope.selected.clone(); // 선택된 날짜 정보를 복사한다.
            var start = scope.selected.clone();
            start.date(1); // 선택된 달의 첫번째 날짜 객체
            scope.eventList = [];
            $http.get('schedule/events').then(function (data) {
                scope.eventList = data.data;
                _removeTime(start.day(0)); // 이달의 첫일의 일요일 날짜의 객체를 시작일로 세팅.
                _buildMonth(scope, start, scope.month); // scope와 시작일, 해당 월의 정보를 넘긴다.
            }, function errorCallback(response){
                console.log('error get Events -> ' +response);
            });

            // 이벤트 추가
            //날짜 선택 이벤트.
            scope.select = function(day, event) {
                scope.selected = day.date;
                var modalInstance = $uibModal.open({
                    templateUrl: "modal/modal_calendar",
                    controller: "ModalContentCtrl",
                    size: ''
                });
                modalInstance.day = day;
                modalInstance.parent = scope;
                modalInstance.positionX = event.clientX;
                modalInstance.width = event.target.parentElement.clientWidth;
                modalInstance.result.then(function (response) {
                    scope.result = '${response} button hitted';
                });
            };
            // 다음달 로 넘기는 이벤트
            scope.next = function() {
                var next = scope.month.clone();
                _removeTime( next.month(   next.month()+1).date(1));
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };
            //이전달로 넘기는 이벤트
            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);

            };

            scope.refresh = function(day ,date, scope){
                day.items = getDayEvents(date, scope.eventList);
            };

            scope.moveDayEvent = function(fromDate, toDate){
                var fromDay = parseInt(fromDate.substring(8));
                var toDay = parseInt(toDate.substring(8));

                var fromIdx = Math.floor((fromDay+(scope.startIndex-1))/7);
                var toIdx = Math.floor((toDay+(scope.startIndex-1))/7);
                var check = 0;
                for(var i = 0; i < 7; i++){
                    if(scope.weeks[fromIdx].days[i].number===fromDay){
                        scope.weeks[fromIdx].days[i].items = getDayEvents(fromDate, scope.eventList);
                        check++;
                    }
                    if(scope.weeks[toIdx].days[i].number===toDay){
                        scope.weeks[toIdx].days[i].items = getDayEvents(toDate, scope.eventList);
                        check++;
                    }
                    if(check===2)
                        break;
                }
                scope.$apply();
            }
        }
    };
    function _buildMonth(scope, start, month){
        // 전달 받은 정보로 해당 월의 정보를 만듬.
        scope.weeks = [];
        scope.startIndex = -1;
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            // start로 넘어온 일을 시작으로 달의 주정보를 생성 weeks 배열에 추가한다.ㅣ
            scope.weeks.push({
                days: _buildWeek(date.clone(), month, scope)
            });

            date.add(1, "w"); // 다음 주로 이동.
            done = count++ > 2 && monthIndex !== date.month(); // 달이 넘어 가면 멈춘다.
            monthIndex = date.month();
        }
    }
    function _buildWeek(date, month, scope) {
        // 한주의 첫번쨰 날과 달의 정보를 받는다.
        var days = []; // 총 7일의 정보가 들어간다.
        for (var i = 0; i < 7; i++) {
            var dayEvent ={
                animation: true,
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                dateType: i,
                items: getDayEvents(new Date(date).yyyyMMddHHmmss().substring(0,10), scope.eventList)
            };
            if(scope.startIndex===-1 && dayEvent.number===1){
                scope.startIndex = i;
            }
            days.push(dayEvent);
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
    function _removeTime(date) {
        // 넘어온 날짜의 제일 첫일[일요일 00:00] 으로 맞추는 역활, 한주의 일요일로 맞추는 역활
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function getDayEvents(id, list){
        var dayEvents = [];
        for(var i = 0; i < list.length; i++){
            if (list[i]["date_event"] === id) {
                dayEvents.push(list[i]);
            }
        }
        return dayEvents;
    }
});

calApp.controller('ModalContentCtrl', function($scope, $uibModalInstance, $http) {
    $scope.events = [];
    $scope.day = $uibModalInstance.day;
    $scope.dateFormat = new Date($scope.day.date);
    $scope.tabMenuIndex = 0;
    $scope.target_time = false;
    $scope.day_event_point = 2;
    $scope.day_event_point_text = '보통';
    $scope.show = function(){
        var posX = $uibModalInstance.positionX;
        var width = $uibModalInstance.width/2 + 5;
        var elem = document.getElementById('modal_content');
        var date = $scope.dateFormat.yyyyMMddHHmmss();
        if($scope.day.items!=null)
            $scope.events = $scope.day.items;
        $scope.today = parseInt(date.substring(5,7))+"월 "+parseInt(date.substring(8,10))+"일" +"("+$scope.day.name+"요일)";
        if(posX * 2> $(document).width()+200){
            elem.style.marginLeft= posX-(400+width)+'px';
        }else{
            elem.style.marginLeft= posX+width+'px';
        }
        $scope.date_event_end = new Date($scope.day.date);
        $scope.day_event_time = new Date($scope.day.date);
    }
    $scope.addEvent = function(){

        if($scope.day_title != null && $scope.day_title.length>0){
            var newEvent = {
                date_event: $scope.dateFormat.yyyyMMddHHmmss().substring(0,10),
                date_event_end: $scope.date_event_end.yyyyMMddHHmmss().substring(0,10),
                event_type : $scope.tabMenuIndex,
                title: $scope.day_title,
                event_description: $scope.day_description,
                event_time: $scope.tabMenuIndex===1 && $scope.target_time ? $scope.day_event_time : null,
                event_point: $scope.tabMenuIndex===1?$scope.day_event_point : 0
            };
            $http({
                method: 'POST',
                url: 'schedule/create',
                data: newEvent
            }).then(function successCallback(response){
                console.log(response);
                $scope.events.push(newEvent);
            }, function errorCallback(response){
                console.log('error create -> ' +response);
            });
        }else{
            alert('이벤트 제목을 입력해주세요.');
        }
        $scope.day_title = null;
        $scope.day_description = null;
        $scope.day_event_point = 2;
        $scope.date_event_end = new Date($scope.day.date);
        $scope.day_event_time = new Date($scope.day.date);
    }
    $scope.removeEvent = function($index, target){
        if(confirm("선택한 이벤트를 삭제하시겠습니까?")){
            $http({
                method: 'DELETE',
                url: 'schedule/delete',
                params: {id:target.id},
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function successCallback(response){
                console.log(response);
                $scope.events.splice($index,1);
            }, function errorCallback(response){
                console.log('error delete -> ' +response);
            });
        }
    }
    $scope.ok = function(){
        $uibModalInstance.parent.selected = null;
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
        var elem = document.getElementById('modal_content');
        elem.style.animationName='animateHide';
        elem.style.opacity='0';
        elem.style.marginTop='100px';
        setTimeout(function() {
            $uibModalInstance.parent.selected = null;
            $uibModalInstance.dismiss();
        }, 250);
    }

    $scope.tabMenuClick = function(index){
        $scope.tabMenuIndex = index;
        setTimeout(function () {
            var height = $('.form_input_day').outerHeight();
            $('.container_day_list').css('height', 'calc(100% - ' + (height-10) + 'px)');
        },50)
    }

    $scope.setEventPoint = function(){

        switch ($scope.day_event_point) {
            case 0:
                $scope.day_event_point_text = '매우 낮음';
                break;
            case 1:
                $scope.day_event_point_text = '낮음';
                break;
            case 2:
                $scope.day_event_point_text = '보통';
                break;
            case 3:
                $scope.day_event_point_text = '중요';
                break;
            case 4:
                $scope.day_event_point_text = '매우 중요';
                break;
        }
    }
});
