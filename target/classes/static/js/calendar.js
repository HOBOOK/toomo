Date.prototype.yyyyMMddHHmmss = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]) + 'T' + (HH[1]?HH : '0'+HH[0]) + ':' + (mm[1]?mm : '0'+mm[0]) + ':'+(ss[1]?ss:'0'+ss[0])+".000";
}

var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var app = angular.module("calendar", ['ngAnimate', 'ui.bootstrap']);

app.controller("calendarWidget", function($scope, $http, $uibModal) {
    //calendar directive에 selected=day 로 정의를 해 둔 상태, 즉 다른 선택된 값이 없는 초기의 경우에는 selected = day 값.
    $scope.day = moment();
});

app.directive("calendar", function($uibModal) {
    return {
        restrict: "E",
        templateUrl: "calendar",
        scope: {
            selected: "="
            // "=" : 부모 scope의 property와 디렉티브의 property를 binding하여 directive에서 부모 scope에 접근하겠다.
            // 그래서 directive는 부모 스코프인 selected객체를 그대로 접근해서 사용이 가능.
        },
        http: {
          selected: "="
        },
        uibModal: {

        },
        link: function(scope, element) {
            scope.eventList = [{
                id: 0,
                date_event: '2020-03-25',
                event_type : 0,
                title: 'ddd',
                event_description: 'ddd'
            },{
                id: 1,
                date_event: '2020-03-25',
                event_type : 0,
                title: 'ddd',
                event_description: 'ddd'
            }];

            // http.get('schedule/events').then(function (data) {
            //     scope.eventList = data.data;
            // });

            scope.month = scope.selected.clone(); // 선택된 날짜 정보를 복사한다.
            var start = scope.selected.clone();
            start.date(1); // 선택된 달의 첫번째 날짜 객체
            _removeTime(start.day(0)); // 이달의 첫일의 일요일 날짜의 객체를 시작일로 세팅.
            _buildMonth(scope, start, scope.month); // scope와 시작일, 해당 월의 정보를 넘긴다.
            // 여기까지 진행이 되면 선택된 일을 기준으로 한달간의 정보의 세팅이 마침. scope.weeks 를 통해 그려려주는 작업 필요.
            //templates/calendar.html 에서 ng-repeat을 통해 그림.
            // 이벤트 추가
            //날짜 선택 이벤트.
            scope.select = function(day, event) {
                scope.selected = day.date;
                var modalInstance = $uibModal.open({
                    templateUrl: "modal/modal_calendar",
                    controller: "ModalContentCtrl",
                    size: ''
                });

                modalInstance.parent = scope;
                modalInstance.date = new Date(day.date).yyyyMMddHHmmss();
                modalInstance.events = [];
                for (var i = 0 ; i < scope.eventList.length; i++) {
                    if (scope.eventList[i]["date_event"] === modalInstance.date.substring(0, 10)) {
                        modalInstance.events.push(scope.eventList[i]);
                    }
                }
                modalInstance.positionX = event.clientX;
                modalInstance.width = event.target.offsetWidth;
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
        }
    };
    function _buildMonth(scope, start, month){
        // 전달 받은 정보로 해당 월의 정보를 만듬.
        scope.weeks = [];
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
            days.push({
                animation: true,
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                items: getDayEvents(new Date(date).yyyyMMddHHmmss().substring(0,10), scope.eventList)
            });
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

app.controller('ModalContentCtrl', function($scope, $uibModalInstance) {
    $scope.events = [];
    $scope.show = function(){
        var posX = $uibModalInstance.positionX;
        var width = $uibModalInstance.width;
        var elem = document.getElementById('modal_content');
        var date = $uibModalInstance.date;
        if($uibModalInstance.events!=null)
            $scope.events = $uibModalInstance.events;
        $scope.today = date.substring(0,4)+"년 "+date.substring(5,7)+"월 "+date.substring(8,10)+"일";
        if(posX * 2> $(document).width()+200){
            elem.style.marginLeft= posX-(400+width)+'px';
        }else{
            elem.style.marginLeft= posX+width+'px';
        }

    }
    $scope.addEvent = function(){
        if($scope.day_title != null && $scope.day_title.length>0){
            var newEvent = {
                id: -1,
                date_event: $uibModalInstance.date.substring(0,10),
                event_type : 0,
                title: 'ddd',
                event_description: 'ddd'
            };
            $scope.events.push(newEvent);
        }else{
            alert('이벤트 제목을 입력해주세요.');
        }
        $scope.day_title = null;
        $scope.day_description = null;
    }
    $scope.removeEvent = function($index){
        if(confirm("선택한 이벤트를 삭제하시겠습니까?")){
            $scope.events.splice($index,1);
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
        // if($event.target.classList.contains('modal-content')){
        //     Console.log($event.target.name);
        // }else{
        //     $uibModalInstance.dismiss();
        // }
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
});
