$(window).on('load',(function() {
    $('.nav').mCustomScrollbar({
        theme: "minimal-dark",
        axis:"y",
        mouseWheelPixels : 200, // 마우스휠 속도
        scrollInertia : 400,
        documentTouchScroll : false,
        autoDraggerLength: false
    });
}));