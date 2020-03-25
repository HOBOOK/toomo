
var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

var app = angular.module('MyApp', ['ngAnimate','ngSanitize'])

app.config(['$qProvider','$httpProvider', function($qProvider, $httpProvider){
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.common[header] = token;
}]);
app.controller('memoController', function ($scope, $http, $compile) {
    $scope.memos = [];
    $http.get('memo/list').then(function (data) {
       $scope.memos = data.data;
    });

    $scope.config = {
        editMode: false,
        editTarget: '-1',
        tempId: 4,
        eventDelay: 0,
        tempText: ''
    };
    $scope.addMemo = function () {
        var date = new Date().yyyyMMddHHmmss();
        $scope.memos.unshift({
            id: -1,
            context: '새로운 메모',
            date_create: date,
            state: 0,
            fix: 0
        });
    }
    $scope.removeMemo = function (memo){
        if(confirm("메모를 삭제하시겠습니까? 삭제된 메모는 휴지통에서 복원할 수 있습니다.")){
            $http({
                method: 'PUT',
                url: 'memo/delete',
                data: {
                    id: memo.id,
                    context: memo.context,
                    state: 1,
                    fix: memo.fix
                }
            }).then(function successCallback(response){
                memo.state = 1;
                $scope.config.editMode=false;
                console.log(response);
            }, function errorCallback(response){
                console.log('error delete -> ' +response);
            });
        }
    }
    $scope.editMemo = function (id){
        if($scope.config.eventDelay!=0)
            return;
        $scope.config.eventDelay = 1;
        if(!$scope.config.editMode){
            $scope.config.editMode = true;
            $scope.config.editTarget = id;
        }
        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 300);
    }
    $scope.updateMemo = function (memo){
        if($scope.config.eventDelay!=0)
            return;
        var context = document.getElementById("memo_context_"+memo.id).innerHTML;
        memo.context = context;

        $scope.config.eventDelay = 1;
        $scope.config.editMode = false;
        $scope.config.editTarget = -1;

        if(memo.id===-1){
            $http({
                method: 'POST',
                url: 'memo/create',
                data: {
                    context: context,
                    state: memo.state,
                    fix: memo.fix
                }
            }).then(function successCallback(response){
                memo.id= $scope.config.tempId++;
                console.log(response);
            }, function errorCallback(response){
                console.log('error create -> ' +response);
            });
        }else{
            $http({
                method: 'PUT',
                url: 'memo/create',
                data: {
                    context: context,
                    state: memo.state,
                    fix: memo.fix,
                    id: memo.id
                }
            }).then(function successCallback(response){
                console.log(response);
            }, function errorCallback(response){
                console.log('error update -> ' +response);
            });
        }
        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 300);
    }
    $scope.setPin = function (set, memo) {
        if($scope.config.eventDelay!=0)
            return;
        var m = $scope.memos[$scope.memos.indexOf(memo)];
        m.fix = set ? 1 : 0;
        $scope.updateMemo(memo);
    }

    //뻘짓 ㅠㅠ
    // $scope.highlightText = function() {
    //
    // }
    // $scope.setBoldText = function(memo) {
    //     $scope.config.eventDelay = 1;
    //     var text = "";
    //
    //     if (typeof window.getSelection != "undefined") {
    //         var sel = window.getSelection();
    //         var start = sel.anchorOffset;
    //         var end = sel.focusOffset;
    //         console.log(start + " > " + end);
    //         if (sel.rangeCount) {
    //             var container = document.createElement("div");
    //             for (var i = 0, len = sel.rangeCount; i < len; ++i) {
    //                 container.appendChild(sel.getRangeAt(i).cloneContents());
    //             }
    //             text = container.innerHTML;
    //         }
    //     } else if (typeof document.selection != "undefined") {
    //         if (document.selection.type == "Text") {
    //             text = document.selection.createRange().htmlText;
    //         }
    //     }
    //     if(text==="")
    //         return;
    //
    //     var target = document.getElementById("memo_context_"+memo.id);
    //     var context = target.innerHTML;
    //     var before = "";
    //     var after = "";
    //
    //     if(text.charAt(0)==='<' && text.charAt(text.length-1)==='>'){
    //         before = context.slice(0, context.indexOf(text));
    //         after = context.slice(context.indexOf(text)+text.length, context.length);
    //         text = text.replace(/(<([^>]+)>)/ig,"");
    //         text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
    //     }
    //     else if(text.search('<span')!== -1){
    //         var matchCount = text.split('<span').length - 1;
    //         if(matchCount>1){
    //             var tempText = text.substring(0,text.lastIndexOf('</span>'));
    //             before = context.slice(0, context.indexOf(tempText));
    //             after = context.slice(context.indexOf(tempText)+text.length, context.length);
    //         }else{
    //             var tempText = text.substring(0,text.indexOf('</span>'));
    //             if(text.substring(0,5)==='<span'){
    //                 before = context.slice(0, context.indexOf(tempText));
    //                 after = context.slice(context.indexOf(tempText)+text.length, context.length);
    //                 if(before.lastIndexOf('<span')!==-1){
    //                     text = text.replace(text.substring(text.indexOf('<span'),text.indexOf('</span>')+7),"");
    //                     text = before.substring(before.lastIndexOf('<span'), before.lastIndexOf('</span>')+7) + text;
    //                     before = before.substring(0, before.lastIndexOf('<span'));
    //                     after = context.slice(context.indexOf(text)+text.length, context.length);
    //                 }
    //             }else if(text.substring(text.length-7,text.length)==='</span>'){
    //                 before = context.slice(0, context.indexOf(tempText));
    //                 after = context.slice(context.indexOf(tempText)+tempText.length, context.length);
    //                 if(after.indexOf('</span>')!==-1){
    //                     text = text.replace(text.substring(text.indexOf('</span>'),text.indexOf('</span>')+7),"");
    //                     text = text + after.substring(0,after.indexOf('</span>')+7);
    //                     after = after.substring(after.indexOf('</span>')+7,after.length);
    //                 }
    //             }
    //         }
    //         text = text.replace(/(<([^>]+)>)/ig,"");
    //         text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
    //         console.log(text);
    //     }else{
    //         before = context.slice(0, context.indexOf(text));
    //         after = context.slice(context.indexOf(text)+text.length, context.length);
    //         if(before.charAt(before.length-1)==='>'&&after.indexOf('</span>')!==-1){
    //             before = before.substring(0,before.lastIndexOf('<span'));
    //             if(after.substring(0,7)==='</span>'){
    //                 after = after.substring(7);
    //             }else{
    //                 after = '<span class=\'context_bold\'\>' + after;
    //             }
    //         } else if(after.substring(0,7)==='</span>'&&before.lastIndexOf('<span')!==-1){
    //             after = after.substring(7);
    //             before = before + '</span>';
    //         }
    //         else{
    //             text = text.replace(/(<([^>]+)>)/ig,"");
    //             text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
    //         }
    //     }
    //
    //     var retText = before + text + after;
    //     memo.context = retText;
    //     target.innerHTML = unescape(memo.context);
    //     setTimeout(function() {
    //         $scope.config.eventDelay = 0;
    //     }, 100);
    // }
});