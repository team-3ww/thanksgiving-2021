$(() => {
    $('.puzzle-6,.puzzle-6-a,.puzzle-7,.puzzle-7-a').mouseenter(() => {
        $('.note').fadeIn();
    });
    $('.puzzle-6,.puzzle-6-a,.puzzle-7,.puzzle-7-a').mouseleave(() => {
        $('.note').fadeOut();
    });
});