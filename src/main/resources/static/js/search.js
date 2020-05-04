var oldVal = "";

$("#input_search").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == oldVal) {
        return;
    }

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


var searchApp = angular.module('SearchApp', ['ngAnimate','ngSanitize','ngFileUpload']);

searchApp.controller('searchController', function ($scope, $http, $compile, Upload) {
    $scope.searchedItems = [];
    $scope.setData = function (data) {
        $scope.searchedItems = data;
    }
}