/* Selector */
let $activeSelect;
let $activeSelectButton;
let $activeSelectDropdown;
let $activeSelectLabel;

let activeSelectColSpan;
let activeSelectId;
let activeSelectOptions;
let isMultipleSelect;

/* Options */
let options;
let optionsStored;
let optionsToSearch;
let selectIndex;


const keyCodes = [35, 36, 38, 40];
const buttonNameLimit = {
    "col1-4" : 20,
    "col1-2" : 32,
    "col3-4" : 50
};

export function buildOptions($select, $options) {

    $options.forEach(function(item) {
        let optionName = $(item).html();

        let optionHtml = `<li class="nm-select__dropdown--option visible" role="none">
                                <a href="#" role="menuitem" class="${item.selected ? 'selected' : ''}">${optionName}</a>
                              </li>`;

        $select.find('.nm-select__dropdown--options').append(optionHtml);
    });
}

export function buildSelectButtonName($select) {

    let buttonName = $select.find('label').html();

    // todo: Set first option as select button name
    if (buttonName === undefined) {

    }

    return buttonName;
}

export function toggleDropdown($selector) {
    console.log(200, $selector);

    setActiveElements($selector);

    if ($activeSelectDropdown.hasClass('open')) {
        $activeSelectDropdown.removeClass('open');
        $selector.find('.nm__btn--caret').css('transform', 'rotate(180deg)');
        $selector.siblings('.nm-select__dropdown--menu').hide();
    } else {
        closeAllDropdowns();
        $activeSelectDropdown.addClass('open');
        $selector.find('.nm__btn--caret').css('transform', 'rotate(180deg)');
        $selector.siblings('.nm-select__dropdown--menu').show();

        if ($activeSelect.parent().hasClass('search')) {
            clearSearchInput();
            clearDropdownAndBuildOptions();
        }

        // navigateToSelectedOption();
    }

    // if (optionsStored === undefined) {
    //     initSelectOptions($activeSelectDropdown);
    // } else {
    //     options = optionsStored;
    // }
}

/* ACTIVE ELEMENTS */

function setActiveElements($selector) {
    activeSelectId = $selector.parent('.nm-select__dropdown').attr('id');
    $activeSelect = $(`select[data-select="${activeSelectId}"]`);
    $activeSelectButton = $selector;
    $activeSelectDropdown = $('#' + activeSelectId);
    $activeSelectLabel = $activeSelect.siblings('label').html();

    activeSelectColSpan = getColSpan($activeSelect.parent().attr('class').split(' '));
    activeSelectOptions = $activeSelect[0].options;
    isMultipleSelect = $activeSelect.attr('multiple');
}

function getColSpan(classList) {
    let colSpan = "";
    classList.forEach(function(element) {
        if(element.startsWith('col')) {
            colSpan = element;
        }
    });
    return colSpan;
}

/* ACTIVE ELEMENTS END */


/* CLOSING ACTIONS */

// Close dropdown after click at document
$(document).click(function(e) {
    if(!$(e.target).is('.nm-select__btn, input[data-search]')) {
        closeAllDropdowns();
    }
});

// Close when ESC
$(document).keydown(function(e) {
    if(e.keyCode === 27) {
        closeAllDropdowns();
    }
});


export function closeAllDropdowns() {
    $('.nm-select__dropdown').removeClass('open');
    $('.nm-select__dropdown--menu').hide();
}

/* CLOSING ACTIONS END */


export function highlightSelection($selector) {
    $('a[role="menuitem"]').removeClass('highlighted');
    $selector.addClass('highlighted');
    // setSelectIndex('.highlighted');
    $('.highlighted').focus();
}