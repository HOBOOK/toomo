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
app.controller('memoController', function ($scope, $compile) {

    $scope.memos = [{
        id: '0',
        context: '<h1>0번메모</h1>',
        dateOfCreate: '2020-03-06 14:27:20',
        state: '0',
        fix: '0'
    },
        {
            id: '1',
            context: '1번 메모',
            dateOfCreate: '2020-03-06 14:27:21',
            state: '0',
            fix: '0'
        },
        {
            id: '2',
            context: '고정된 2번메모',
            dateOfCreate: '2020-03-06 14:27:22',
            state: '0',
            fix: '1'
        },
        {
            id: '3',
            context: 'hide된 3번메모',
            dateOfCreate: '2020-03-06 14:27:23',
            state: '1',
            fix: '0'
        }
    ];
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
            dateOfCreate: date,
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

        if(text.search('<span')!== -1){
            if(text.charAt(0)==='<'){
                before = context.slice(0, context.indexOf(text));
                after = context.slice(context.indexOf(text)+text.length, context.length);
                if(before.lastIndexOf('<span')!==-1){
                    text = text.replace(text.substring(text.indexOf('<span'),text.indexOf('</span>')+7),"");
                    text = before.substring(before.lastIndexOf('<span'), before.lastIndexOf('</span>')+7) + text;
                    before = before.substring(0, before.lastIndexOf('<span'));
                    after = context.slice(context.indexOf(text)+text.length, context.length);
                }
            }else{
                var tempText = text.substring(0,text.indexOf('</span>'));
                before = context.slice(0, context.indexOf(tempText));
                after = context.slice(context.indexOf(tempText)+tempText.length, context.length);
                if(after.indexOf('</span>')!==-1){
                    text = text.replace(text.substring(text.indexOf('</span>'),text.indexOf('</span>')+7),"");
                    text = text + after.substring(0,after.indexOf('</span>'+7));
                    after = after.substring(after.indexOf('</span>'+7));
                }
            }
            while(text.search('<span') !== -1){
                text = text.replace(text.substring(text.indexOf('<span'),text.indexOf('>')+1),"");
            }
            while(text.search('</span>')!==-1){
                text = text.replace(text.substring(text.indexOf('</span>'),text.indexOf('</span>')+7),"");
            }

            text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';


        }else{
            before = context.slice(0, context.indexOf(text));
            after = context.slice(context.indexOf(text)+text.length, context.length);
            if(after.substring(0,7)==='</span>'){
                before = before.substring(0,before.lastIndexOf('<span'));
                after = after.substring(7,after.length);
            }
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '<span class=\'context_bold\'\>' + text + '\<\/span\>';
        }

        var retText = before + text + after;
        memo.context = retText;
        target.innerHTML = unescape(memo.context);
        setTimeout(function() {
            $scope.config.eventDelay = 0;
        }, 100);
    }
});