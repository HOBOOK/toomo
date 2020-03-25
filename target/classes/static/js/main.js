$(window).on('load',(function() {
    $('.nav').mCustomScrollbar({
        theme: "minimal-dark",
        axis:"y",
        mouseWheelPixels : 200, // 마우스휠 속도
        scrollInertia : 400,
        documentTouchScroll : false,
        autoDraggerLength: false
    });
    var toggleVal = getCookie('toggleBar');
    if(toggleVal==null || toggleVal=='false'){
        $('.mybar').css('width','0px');
        $('.mybar_toggle').css('box-shadow','1px 2px 3px 1px rgba(0,0,0,0.2)');
        $('.container_main').css('width','calc(100% - 80px)');
    }else{
        $('.mybar').css('width','250px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 330px)');
    }
}));

function toggleBar() {
    var val = getCookie('toggleBar');
    if(val==null || val=='false'){
        setCookie('toggleBar', true, 7);
        val = true;
    }else{
        setCookie('toggleBar', false, 7);
        val = false;
    }
    if(val){
        $('.mybar').css('width','250px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 330px)');
    }else{
        $('.mybar').css('width','0px');
        $('.mybar_toggle').css('box-shadow','1px 2px 3px 1px rgba(0,0,0,0.2)');
        $('.container_main').css('width','calc(100% - 80px)');
    }
}
function setCookie(name, value, exp){
    var date = new Date();
    date.setTime(date.getTime() + exp*24*60*1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(name){
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}