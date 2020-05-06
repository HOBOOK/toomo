var oldVal = "";

document.getElementById('input_search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searching();
    }
});
$("#input_search").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == oldVal) {
        return;
    }
    var cnt = 0;
    $.getJSON('searchedtext', {keyword:$('#input_search').val()}, function (data) {
        cnt = data.length;
        $('.search_view').empty();
        var key = $('#input_search').val();
        $.each(data,function () {
            var keyIdx = this.title.toLowerCase().indexOf(key.toLowerCase());
            if(keyIdx===-1){
                $('.search_view').append('<span>'+this.title+'</span></br>');
            }else{
                var prefix = '<span>'+this.title.substring(0,keyIdx);
                var target = '<b>'+this.title.substring(keyIdx, keyIdx+key.length) + '</b>';
                var suffix = this.title.substring(keyIdx+key.length) + '</span></br>';
                $('.search_view').append(prefix + target + suffix);
            }
        });
        oldVal = currentVal;
        if(oldVal.toString().length>0){
            $('.btn_search_remove').css("display","inline-block");
            if(cnt>0)
                $('.search_view').css("display","inline-block");
            else
                $('.search_view').css("display","none");
        }else{
            $('.btn_search_remove').css("display","none");
            $('.search_view').css("display","none");
        }
    });
});

function searching() {
    var keyword = $('#input_search').val();
    window.location.href = "/search?keyword=" + keyword;
}
function clearSearch() {
    $('#input_search').val("");
    $('.btn_search_remove').css("display","none");
    $('.search_view').css("display","none");
}


var searchApp = angular.module('SearchApp', ['ngAnimate','ngSanitize']);

searchApp.controller('searchController', function ($scope, $http, $compile) {
    $scope.searchedItems = [];
    $scope.todoListAppScope = angular.element(document.querySelector('[ng-app=BarApp]')).scope();
    $http.get('/search/result').then(function (data) {
        $scope.searchedItems = data.data;
    });
    $scope.display = function(){
        return {
            "display" : "inline-block"
        };
    }
    $scope.getObjectDate = function (searchItem) {
        var date = new Date(searchItem.date.toString());
        return date.getFullYear() + "년 " + date.getMonth()+"월 " + date.getDate()+"일";
    }

    $scope.select = function (searchItem, $event){
        if(searchItem.type===0){
            $http.get('memo/select?id='+searchItem.id).then(function (data) {
                console.log('go to memo' + data);
            });
        }else{
            $http.get('schedule/event?id='+searchItem.id).then(function (data) {
                $scope.todoListAppScope.select(data.data, $event);
            }, function errorCallback(response){
                console.log('error get Event -> ' +response);
            });

        }
    }
})