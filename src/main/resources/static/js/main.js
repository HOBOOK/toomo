$(document).ready(function(){
    initTheme();
    initToggleBar();
    initToggleTodoBar();

    $('.nav').mCustomScrollbar({
        theme: "minimal-dark",
        axis:"y",
        mouseWheelPixels : 200, // 마우스휠 속도
        scrollInertia : 400,
        documentTouchScroll : false,
        autoDraggerLength: false
    });
});

var isToggleBar;
var isToggleTodoBar;
var colorPickerColors = [
    [46, 204, 113],
    [52, 152, 219],
    [155, 89, 182],
    [52, 73, 94],
    [241, 196, 15],
    [230, 126, 34],
    [231, 76, 60]
];

Date.prototype.yyyyMMddHHmmss = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]) + 'T' + (HH[1]?HH : '0'+HH[0]) + ':' + (mm[1]?mm : '0'+mm[0]) + ':'+(ss[1]?ss:'0'+ss[0])+".000";
}
Date.prototype.yyyyMMdd = function () {
    var yyyy = this.getFullYear().toString();
    var MM = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + '-'+(MM[1] ? MM : '0'+MM[0]) + '-'+(dd[1] ? dd : '0'+dd[0]);
}
function initTheme(){
    var toggleTheme = getCookie('toggleTheme');
    if(toggleTheme==null || toggleTheme=='false'){
        $('body').removeClass("dark");
    }else{
        $('body').addClass("dark");
    }
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function toggleBar() {
    if(isToggleBar==null || isToggleBar===false){
        setCookie('toggleBar', true, 7);
        isToggleBar = true;
        $('.mybar').css('right','0px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 380px)');
    }else{
        setCookie('toggleBar', false, 7);
        isToggleBar = false;
        $('.mybar').css('right','-300px');
        $('.mybar_toggle').css('box-shadow','1px 2px 3px 1px rgba(0,0,0,0.2)');
        $('.container_main').css('width','calc(100% - 80px)');
    }
    $('.mybar').css('transition','0.3s all ease-in-out');
    $('.container_main').css('transition','0.3s all ease-in-out');
}
function initToggleBar(){
    isToggleBar = getCookie('toggleBar') === 'true';
    if(isToggleBar){
        $('.mybar').css('right','0px');
        $('.mybar_toggle').css('box-shadow','none');
        $('.container_main').css('width','calc(100% - 380px)');
    }
}

function toggleTodoBar() {
    $('.todo_list').css('transition','0.3s height ease-in-out');
    $('.todo_complete').css('transition','0.3s height ease-in-out');

    if(!isToggleTodoBar){
        setCookie('toggleTodoBar', true, 7);
        isToggleTodoBar = true;
        $('.todo_complete').css('height','47px');
        $('.todo_list').css('height','calc(100% - 47px)');
    }else{
        setCookie('toggleTodoBar', false, 7);
        isToggleTodoBar = false;
        $('.todo_list').css('height','50%');
        $('.todo_complete').css('height','50%');
    }
}
function initToggleTodoBar(){
    isToggleTodoBar = getCookie('toggleTodoBar') === 'true';
    if(isToggleTodoBar){
        $('.todo_list').css('height','calc(100% - 47px)');
        $('.todo_complete').css('height','47px');
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