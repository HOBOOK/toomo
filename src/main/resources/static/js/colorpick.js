/*

	Bubble color picker
	By @Lewitje

	Have fun with it!

*/

var colorPicker = (function(){

    var config = {
        baseColors: colorPickerColors,
        lightModifier: 20,
        darkModifier: 0,
        transitionDuration: 200,
        transitionDelay: 25,
        variationTotal: 10
    };

    var state = {
        activeColor: [0, 0, 0]
    };

    function init(){
        createColorPicker(function(){
            appendBaseColors();
        });

        addEventListeners();

        setFirstColorActive(function(){
            setFirstModifiedColorActive();
        });
    }

    function setActiveBaseColor(el){
        $('.color.active').removeClass('active');
        el.addClass('active');
        state.activeColor = el.data('color').split(',');
    }

    function addEventListeners(){
        $('body').on('click', '.color', function(){
            var color = $(this).data('color').split(',');
            setActiveBaseColor($(this));
            console.log(state.activeColor);
            console.log(colorPickerColors.indexOf([state.activeColor[0],state.activeColor[1],state.activeColor[2]]));
        });
    }

    function setFirstColorActive(callback){
        $('.color').eq(0).trigger('click');
        callback();
    }

    function setFirstModifiedColorActive(){
        setTimeout(function(){
            $('.color-var').eq(7).trigger('click');
        }, 500);
    }

    function createColorPicker(callback){
        $('.color-picker').append('<div class="base-colors"></div>');
        $('.color-picker').append('<div class="varied-colors"></div>');
        $('.color-picker').append('<div class="active-color"></div>');
        $('.color-picker').append('<div class="color-history"></div>');

        callback();
    }

    function appendBaseColors(){
        for(i = 0; i < config.baseColors.length; i++){
            $('.base-colors').append('<div class="color" data-color="' + config.baseColors[i].join() + '" style="background-color: rgb(' + config.baseColors[i].join() + ');"></div>');
        }
    };

    return{
        init: init
    };

}());

colorPicker.init();