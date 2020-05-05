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

    $('.search_view').empty();
    $.getJSON('searchedtext', {keyword:$('#input_search').val()}, function (data) {
        $.each(data,function () {
            $('.search_view').append(this.title+'</br>');
        });
    });

    oldVal = currentVal;
    if(oldVal.toString().length>0){
        $('.btn_search_remove').css("display","inline-block");
        $('.search_view').css("display","inline-block");
    }else{
        $('.btn_search_remove').css("display","none");
        $('.search_view').css("display","none");
    }
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
    $http.get('/search/result').then(function (data) {
        $scope.searchedItems = data.data;
    });
    $scope.display = function(){
        return {
            "display" : "inline-block"
        };
    }

})