Date.prototype.yyyyMMddHHmmss = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]) + ' ' + (HH[1]?HH : '0'+HH[0]) + ':' + (mm[1]?mm : '0'+mm[0]) + ':'+(ss[1]?ss:'0'+ss[0]);
}
var app = angular.module('MyApp', ['ngAnimate','ngSanitize'])

app.config(['$qProvider', function($qProvider){
    $qProvider.errorOnUnhandledRejections(false);
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
            id: $scope.config.tempId++,
            context: 'New?',
            date_create: date,
            state: '0',
            fix: '0'
        });
    }
    $scope.removeMemo = function (memo){
        memo.state = 1;
        $scope.config.editMode=false;
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

        var sendDate = JSON.stringify({
            id: memo.id,
            creator: memo.creator,
            context: memo.context,
            state: memo.state,
            fix: memo.fix,
            date_create: memo.date_create,
            date_update: memo.date_create
        });
        $http({
           method: 'POST',
           url: 'memo/create',
           data: JSON.stringify(sendDate),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function successCallback(response){
            console.log(response);
        }, function errorCallback(response){
            console.log('error -> ' +response.data);
        });

        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 300);
    }
    $scope.setPin = function (set, memo) {
        $scope.config.eventDelay = 1;
        var m = $scope.memos[$scope.memos.indexOf(memo)];
        m.fix = set ? 1 : 0;
        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 100);
    }
    $scope.highlightText = function() {

    }
    $scope.setBoldText = function(memo) {
        $scope.config.eventDelay = 1;
        var text = "";

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            var start = sel.anchorOffset;
            var end = sel.focusOffset;
            console.log(start + " > " + end);
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                text = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                text = document.selection.createRange().htmlText;
            }
        }
        if(text==="")
            return;

        var target = document.getElementById("memo_context_"+memo.id);
        var context = target.innerHTML;
        var before = "";
        var after = "";

        if(text.charAt(0)==='<' && text.charAt(text.length-1)==='>'){
            before = context.slice(0, context.indexOf(text));
            after = context.slice(context.indexOf(text)+text.length, context.length);
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
        }
        else if(text.search('<span')!== -1){
            var matchCount = text.split('<span').length - 1;
            if(matchCount>1){
                var tempText = text.substring(0,text.lastIndexOf('</span>'));
                before = context.slice(0, context.indexOf(tempText));
                after = context.slice(context.indexOf(tempText)+text.length, context.length);
            }else{
                var tempText = text.substring(0,text.indexOf('</span>'));
                if(text.substring(0,5)==='<span'){
                    before = context.slice(0, context.indexOf(tempText));
                    after = context.slice(context.indexOf(tempText)+text.length, context.length);
                    if(before.lastIndexOf('<span')!==-1){
                        text = text.replace(text.substring(text.indexOf('<span'),text.indexOf('</span>')+7),"");
                        text = before.substring(before.lastIndexOf('<span'), before.lastIndexOf('</span>')+7) + text;
                        before = before.substring(0, before.lastIndexOf('<span'));
                        after = context.slice(context.indexOf(text)+text.length, context.length);
                    }
                }else if(text.substring(text.length-7,text.length)==='</span>'){
                    before = context.slice(0, context.indexOf(tempText));
                    after = context.slice(context.indexOf(tempText)+tempText.length, context.length);
                    if(after.indexOf('</span>')!==-1){
                        text = text.replace(text.substring(text.indexOf('</span>'),text.indexOf('</span>')+7),"");
                        text = text + after.substring(0,after.indexOf('</span>')+7);
                        after = after.substring(after.indexOf('</span>')+7,after.length);
                    }
                }
            }
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
            console.log(text);
        }else{
            before = context.slice(0, context.indexOf(text));
            after = context.slice(context.indexOf(text)+text.length, context.length);
            if(before.charAt(before.length-1)==='>'&&after.indexOf('</span>')!==-1){
                before = before.substring(0,before.lastIndexOf('<span'));
                if(after.substring(0,7)==='</span>'){
                    after = after.substring(7);
                }else{
                    after = '<span class=\'context_bold\'\>' + after;
                }
            } else if(after.substring(0,7)==='</span>'&&before.lastIndexOf('<span')!==-1){
                after = after.substring(7);
                before = before + '</span>';
            }
            else{
                text = text.replace(/(<([^>]+)>)/ig,"");
                text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
            }
        }

        var retText = before + text + after;
        memo.context = retText;
        target.innerHTML = unescape(memo.context);
        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 100);
    }
});