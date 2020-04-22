/*

	Bubble color picker
	By @Lewitje

	Have fun with it!

*/

var colorPicker = (function(){

    var config = {
        baseColors: [
            [46, 204, 113],
            [52, 152, 219],
            [155, 89, 182],
            [52, 73, 94],
            [241, 196, 15],
            [230, 126, 34],
            [231, 76, 60]
        ],
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
            setBackgroundColor();
            console.log(state.activeColor);
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

    function setBackgroundColor(){
        $('body').css({
            'background-color': 'rgb(' + state.activeColor + ')'
        });
    }
    return{
        init: init
    };

}());

colorPicker.init();