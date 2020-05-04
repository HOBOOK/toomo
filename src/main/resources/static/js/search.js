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

function clearSearch() {
    $('#input_search').val("");
    $('.btn_search_remove').css("display","none");
    $('.search_view').css("display","none");
}
