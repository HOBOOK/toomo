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
    $(window).resize(function() {
        $scope.$apply(function() {
            var day_cover_height = $('.container_days').height()/$scope.$$childHead.weeks.length-30;
            $scope.$$childHead.day_event_length = Math.floor(day_cover_height/22);
        });
    });
    $scope.todoListAppScope = angular.element(document.querySelector('[ng-app=BarApp]')).scope();
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
            scope.holiday = [];
            var dateItemColos = ['a','b','c','d','e','f','g'];
            $http.get('schedule/events').then(function (data) {
                scope.eventList = data.data;
                _removeTime(start.day(0));
                _buildMonth(scope, start, scope.month);
                var day_cover_height = $('.container_days').height()/scope.weeks.length-30;
                scope.day_event_length = Math.floor(day_cover_height/22);
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
                modalInstance.todoListAppScope = scope.$parent.todoListAppScope;
                modalInstance.day = day;
                modalInstance.parent = scope;
                modalInstance.positionX = event.clientX;
                modalInstance.width = event.target.parentElement.clientWidth;
                modalInstance.result.then(function (response) {
                    scope.result = '${response} button hitted';
                });
            };
            //일정 선택 이벤트
            scope.viewEvent = function(day, event, $event) {
                var modalInstance = $uibModal.open({
                    templateUrl: "modal/modal_event",
                    controller: "ModalEventContentCtrl",
                    size: ''
                });
                modalInstance.todoListAppScope = scope.$parent.todoListAppScope;
                modalInstance.positionX = $event.currentTarget.getBoundingClientRect().x;
                modalInstance.positionY = $event.currentTarget.getBoundingClientRect().y;
                modalInstance.width = $event.currentTarget.clientWidth;
                //Internet Explorer 예외
                if(modalInstance.positionX==undefined){
                    var elem = $event.currentTarget;
                    var top = 0, left = 0;
                    do {
                        top += elem.offsetTop  || 0;
                        left += elem.offsetLeft || 0;
                        elem = elem.offsetParent;
                    } while(elem);
                    modalInstance.positionX = left;
                    modalInstance.positionY = top;
                    modalInstance.width = $event.currentTarget.offsetWidth;
                }

                modalInstance.parent = scope;
                modalInstance.day = day;
                modalInstance.eventInfo = event;
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
            };
            scope.viewUpdate = function(fromDate, toDate){
                var currDate = new Date(fromDate);
                var currDay = parseInt(fromDate.substring(8));
                var currIdx =  Math.floor((currDay+(scope.startIndex-1))/7);
                var len = new Date(toDate).getDate() - currDate.getDate();
                var cnt = 0;
                var weekIdx = 0;
                while(cnt<=len){
                    if(scope.weeks[currIdx].days[weekIdx].number===currDay){
                        scope.weeks[currIdx].days[weekIdx].items = getDayEvents(currDate.yyyyMMdd(), scope.eventList);
                        currDay++;
                        currDate.setDate(currDay);
                        cnt++;
                    }
                    weekIdx++;
                    if(weekIdx>=7){
                        currIdx++;
                        if(currIdx>=scope.weeks.length)
                            break;
                        weekIdx=0;
                    }
                }
            };
            scope.viewAllUpdate = function(){
                for(var i = 0; scope.weeks.length; i++){
                    for(var j = 0; j < scope.weeks[i].days.length; j++){
                        scope.weeks[i].days[j].items = getDayEvents(scope.weeks[i].days[j].date._d.yyyyMMdd(), scope.eventList);
                    }
                }
                return true;
            };
            scope.hoverEvent = function (item, $event) {
                if(item.event_type!==0) return;
                var elements = document.getElementsByClassName('item ' + item.id);
                for(var i = 0; i < elements.length; i++){
                    elements[i].style.opacity="0.85";
                }
            }
            scope.leaveEvent = function (item, $event) {
                if(item.event_type!==0) return;
                var elements = document.getElementsByClassName('item ' + item.id);
                for(var i = 0; i < elements.length; i++){
                    elements[i].style.opacity="1";
                }
            }
            scope.getDateItemClass = function (item) {
                if(item.event_type===0){
                    return "item " + item.id + " " + dateItemColos[item.event_color];
                }else if(item.event_type===1){
                    return "item todo";
                }else if(item.event_type===2){
                    var hideHolidayOpt = getCookie('hideHoliday');
                    if(hideHolidayOpt== null || hideHolidayOpt == 'false'){
                        return 'item holiday'
                    }else{
                        return 'item holiday hide'
                    }
                }
            }

            scope.getDateItemSubClass = function(item){
                if(item.event_state===1 && item.event_type===1){
                    return 'item todo clear';
                }
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
        var targetDay = new Date(id);
        for(var i = 0; i < list.length; i++){
            if(list[i].event_type===0){
                var startDate = new Date(list[i]["date_event"]);
                var endDate = new Date(list[i]["date_event_end"]);
                if (list[i]["date_event"] === id) {
                    list[i].pos = 'start';
                    dayEvents.push(list[i]);
                }else if(list[i]["date_event_end"] === id){
                    list[i].pos = 'end';
                    dayEvents.push(list[i]);
                }else if(targetDay>=startDate && targetDay <= endDate){
                    list[i].pos = 'path';
                    dayEvents.push(list[i]);
                }
            }else if(list[i].event_type===1){
                if (list[i]["date_event"] === id) {
                    dayEvents.push(list[i]);
                }
            }else if(list[i].event_type===2){
                if (list[i]["date_event"] === id) {
                    dayEvents.push(list[i]);
                }
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
    $scope.isAllDay = true;
    $scope.day_event_point = 2;
    $scope.day_event_point_text = '보통';
    $scope.day_event_color = 0;
    $scope.colorPickerColors = colorPickerColors;

    $scope.viewEvent = function(event, $event){
        $uibModalInstance.parent.viewEvent($scope.day, event, $event);
    }
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
        $scope.tabMenuClick(0);
    }
    $scope.addEvent = function(){
        if($scope.day_title != null && $scope.day_title.length>0){
            var newEvent = {
                date_event: $scope.dateFormat.yyyyMMddHHmmss().substring(0,10),
                date_event_end: $scope.date_event_end.yyyyMMddHHmmss().substring(0,10),
                event_type : $scope.tabMenuIndex,
                title: $scope.day_title,
                event_description: $scope.day_description,
                event_time: $scope.tabMenuIndex===1 && !$scope.isAllDay ? $scope.day_event_time : null,
                event_point: $scope.tabMenuIndex===1?$scope.day_event_point : 0,
                event_color: $scope.tabMenuIndex===0 ?$scope.day_event_color : 0,
                event_state: 0
            };
            $http({
                method: 'POST',
                url: 'schedule/create',
                data: newEvent
            }).then(function successCallback(response){
                newEvent.id = response.data.id;
                $scope.events.push(newEvent);
                $uibModalInstance.parent.eventList.push(newEvent);
                if(newEvent.event_type===1){
                    // TodoList 갱신
                    if($uibModalInstance.todoListAppScope==null){
                        console.log('error update view -> TodoList');
                        return;
                    }
                    $uibModalInstance.todoListAppScope.addTimeString(newEvent);
                    $uibModalInstance.todoListAppScope.events.push(newEvent);
                    $uibModalInstance.todoListAppScope.$apply();
                }
                $uibModalInstance.parent.viewAllUpdate();
                console.log('success create -> ' + response);
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
        }, 200);
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
    $scope.checkingTodoClear = function(event){
        if(event.event_state===1 && event.event_type===1){
            return "fs-14 line-through";
        }else{
            return "fs-14";
        }
    }

    //Color Pickers Method..
    $scope.getColorPickColors = function (color) {
        return {
            "background-color" : "rgb(" + color[0] + ", " +color[1] + ", " +color[2] +")"
        };
    }

    $scope.changeColor = function($index){
        $scope.day_event_color = $index;
    }
    //
});

calApp.controller('ModalEventContentCtrl', function($scope, $uibModalInstance, $http) {
    $scope.event = {};
    $scope.eventDefaultData = {};
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
            elem.style.marginLeft= posX+(width)+'px';
        }
        var correctHeight = window.outerHeight - (posY + elem.offsetHeight);

        if(correctHeight<50){
            if($scope.event.event_type===0)
                elem.style.marginTop = posY - 280 +'px';
            else if($scope.event.event_type===1){
                elem.style.marginTop = posY - 296 +'px';
            }
        }else{
            elem.style.marginTop = posY+'px';
        }

        if($scope.event.event_time!=null){
            $scope.event.event_time_temp = new Date($scope.event.event_time);
            $scope.event.event_time_end_temp = $scope.event.date_event_end !== null ? new Date($scope.event.date_event_end) : new Date($scope.event.date_event);
            $scope.event.isAllDay = false;
        }else{

            $scope.event.event_time_temp = new Date($scope.event.date_event);
            $scope.event.event_time_end_temp = $scope.event.date_event_end !== null ? new Date($scope.event.date_event_end) : new Date($scope.event.date_event);
            $scope.event.isAllDay = true;
        }

        $scope.colorPickerColors = colorPickerColors;
        $scope.isLoadCompleted = true;
        $scope.eventDefaultData = clone($scope.event);

    };

    $scope.$watch('event ', function (newValue, oldValue) {
        if($scope.isLoadCompleted && newValue!==oldValue && !$scope.isUpdated ){
            $scope.isUpdated = true;
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
                $uibModalInstance.day.items.splice($uibModalInstance.day.items.indexOf($uibModalInstance.eventInfo),1);
                //$uibModalInstance.todoListAppScope.events.splice($uibModalInstance.todoListAppScope.events.indexOf($uibModalInstance.eventInfo),1);
                if($scope.event.event_type===1) {
                    var todoListScopeEvents = $scope.event.event_state===0 ? $uibModalInstance.todoListAppScope.events : $uibModalInstance.todoListAppScope.clearEvents;
                    for(var i = 0; i < todoListScopeEvents.length; i++){
                        if(todoListScopeEvents[i].id===$scope.event.id){
                            todoListScopeEvents.splice(i,1);
                            $uibModalInstance.todoListAppScope.$apply();
                            break;
                        }
                    }
                }

                for(var j = 0; j < $uibModalInstance.parent.eventList.length; j++){
                    if($uibModalInstance.parent.eventList[j].id===$scope.event.id){
                        $scope.close();
                        $uibModalInstance.parent.eventList.splice(j,1);
                        $uibModalInstance.parent.viewAllUpdate();
                        break;
                    }
                }
            }, function errorCallback(response){
                console.log('error delete -> ' +response);
            });
        }
    }
    $scope.saveEvent = function(){
        if($scope.event.event_type===2)
            return;
        $http({
            method: 'PUT',
            url: 'schedule/create',
            data: {
                id: $scope.event.id,
                date_event: $scope.event.event_time_temp.yyyyMMdd(),
                date_event_end: $scope.event.event_time_end_temp.yyyyMMdd(),
                event_time: $scope.event.isAllDay ? null : $scope.event.event_time_temp.yyyyMMddHHmmss(),
                title: $scope.event.title,
                event_description: $scope.event.event_description,
                event_type: $scope.event.event_type,
                event_state: $scope.event.event_state,
                event_point: $scope.event.event_point,
                event_color: $scope.event.event_color
            }
        }).then(function successCallback(response){
            console.log('success update -> ' + response);
            alert('성공적으로 변경된 사항이 저장되었습니다.');
            if($scope.event.event_type===0){
                $scope.event.date_event = $scope.event.event_time_temp.yyyyMMddHHmmss();
                $scope.event.date_event_end = $scope.event.event_time_end_temp.yyyyMMddHHmmss();
                $scope.eventDefaultData = clone($scope.event);
                $uibModalInstance.parent.viewAllUpdate();
            }else if($scope.event.event_type===1){
                var afterDateEvent = $scope.event.event_time_temp.yyyyMMddHHmmss();
                $scope.event.date_event = afterDateEvent.substring(0,10);
                $scope.event.event_time = $scope.event.isAllDay ? null : afterDateEvent;

                // 할일 목록창 갱신
                if($scope.event.event_time==null){
                    $scope.event.event_time_string = getEventTimeStringByDateTime($scope.event.date_event, false);
                }else {
                    $scope.event.event_time_string = getEventTimeStringByDateTime($scope.event.event_time, true);
                }
                // 완료 상태 변경시
                if($scope.eventDefaultData.event_state !== $scope.event.event_state){
                    $uibModalInstance.todoListAppScope.clearEvent($scope.eventDefaultData);
                }
                $scope.eventDefaultData = clone($scope.event);
                var todoListScopeEvents ={};
                if($scope.event.event_state===0){
                    todoListScopeEvents = $uibModalInstance.todoListAppScope.events;
                }else{
                    todoListScopeEvents = $uibModalInstance.todoListAppScope.clearEvents;
                }
                for(var i = 0; i < todoListScopeEvents.length; i++){
                    if(todoListScopeEvents[i].id===$scope.event.id){

                        todoListScopeEvents[i] = $scope.event;
                        $uibModalInstance.todoListAppScope.$apply();
                        $uibModalInstance.parent.viewAllUpdate();
                        break;
                    }
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
        $scope.rollbackData();
        var elem = document.getElementById('modal_event_content');
        elem.style.animationName='animateFadeHide';
        elem.style.opacity='0';
        setTimeout(function() {
            $uibModalInstance.dismiss();
        }, 200);
    }

    $scope.rollbackData = function(){
        $scope.event.event_state = $scope.eventDefaultData.event_state;
        $scope.event.event_color = $scope.eventDefaultData.event_color;
        $scope.event.title = $scope.eventDefaultData.title;
        $scope.event.date_event = $scope.eventDefaultData.date_event;
        $scope.event.date_event_end = $scope.eventDefaultData.date_event_end;
        $scope.event.event_point = $scope.eventDefaultData.event_point;

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
    $scope.clearTodo = function(){
        $scope.event.event_state = $scope.event.event_state===0 ? 1 : 0;
    }

    //Color Pickers Method..
    $scope.getColorPickColors = function (color) {
        return {
            "background-color" : "rgb(" + color[0] + ", " +color[1] + ", " +color[2] +")"
        };
    }

    $scope.changeColor = function($index){
        $scope.event.event_color = $index;
    }

    //
});

angular.bootstrap(document.getElementById('calendar'), ['calendar']);