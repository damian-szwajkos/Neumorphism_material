export function initInputs() {
    /* INPUTS */
    $('.nm__form-group input').focus(function() {
        $(this).siblings('label').addClass('focus').removeClass('no-focus');
    });

    $('.nm__form-group input').blur(function() {
        if($(this).val() === "") {
            $(this).siblings('label').addClass('no-focus').removeClass('focus');
        }
    });
}