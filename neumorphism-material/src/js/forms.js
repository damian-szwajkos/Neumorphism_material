export function initForms() {
    console.log("Forms ready")

    /* INPUTS */
    let $formGroupInput = $('.nm__form-group input');

    $formGroupInput.focus(function() {
        $(this).siblings('label').addClass('focus').removeClass('no-focus');
    });

    $formGroupInput.blur(function() {
        if($(this).val() === "") {
            $(this).siblings('label').addClass('no-focus').removeClass('focus');
        }
    });
}