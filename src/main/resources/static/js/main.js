$(document).ready(function(){
    var toggleTheme = getCookie('toggleTheme');
    if(toggleTheme==null || toggleTheme=='false'){
        $('body').removeClass("dark");
    }else{
        $('body').addClass("dark");
    }

    var toggleVal = getCookie('toggleBar');
    if(toggleVal==null || toggleVal=='false'){
        $('.mybar').css('right','-300px');
        $('.mybar_toggle').css('box-shadow','1px 2px 3px 1px rgba(0,0,0,0.2)');
        $('.container_main').css('width','calc(100% - 80px)');
    }else{
        $('.mybar').css('right','0px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 380px)');
    }
    $('.nav').mCustomScrollbar({
        theme: "minimal-dark",
        axis:"y",
        mouseWheelPixels : 200, // 마우스휠 속도
        scrollInertia : 400,
        documentTouchScroll : false,
        autoDraggerLength: false
    });
});

Date.prototype.yyyyMMddHHmmss = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]) + 'T' + (HH[1]?HH : '0'+HH[0]) + ':' + (mm[1]?mm : '0'+mm[0]) + ':'+(ss[1]?ss:'0'+ss[0])+".000";
}

function toggleBar() {
    var val = getCookie('toggleBar');
    if(val==null || val=='false'){
        setCookie('toggleBar', true, 7);
        val = true;
    }else{
        setCookie('toggleBar', false, 7);
        val = false;
    }
    $('.mybar').css('transition','0.3s all ease-in-out');
    $('.container_main').css('transition','0.3s all ease-in-out');
    if(val){
        $('.mybar').css('right','0px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 380px)');
    }else{
        $('.mybar').css('right','-300px');
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

function toggleProfile(){
    var element = $('.account_remote');
    if(element.css( "display" )==='none'){
        element.css('display','inline-block');
    }else{
        element.css('display','none');
    }
}