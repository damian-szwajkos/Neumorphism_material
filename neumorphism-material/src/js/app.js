import '../styles/style.min.css';
import {initInputs} from './forms';


// TODO: NAMING CONVENTIONS    nm-block__element--modifier
//                             nm-block-name__element--modifier ex. nm-select-dropdown__menu
//                             names are separate just with single -



// TODO:
// 1. Add WCAG attributes - for inputs also
//    1.A Mark as expanded and collapsed - add hidden span
// 2. For simple select add search by typing first letter of option - navigate to that option
// 3. Select option by ENTER
// 4. Close select by ESC
// 5. Add search option - Add class ex. nm-search - When class added append input to dropdown
// 6. Multiple select changes - Chosen values should appear on select button


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

$(document).ready(function() {

    initInputs();

    /* BUILD SELECT */

    $('.nm-select').each(function(index) {

        let $this = $(this);

        // Add special attribute to select
        $this.find('select').attr('data-select', 'nm-select--' + index);

        let dropdownHtml = `<div class="nm-select__dropdown" id="nm-select--${index}">
                                <div class="nm-select__btn" role="button">
                                    <span class="nm-select__btn--name">${buildSelectButtonName($this)}</span>
                                    <span class="nm-select__btn--caret"></span>
                                </div>
                                <div class="nm-select__dropdown--menu">
                                    <ul class="nm-select__dropdown--options" role="menu"></ul>
                                </div>
                            </div>`;


        $this.append(dropdownHtml);


        let $optGroups = $this.find('select').find('optgroup').toArray();

        if ($optGroups.length > 0) {
            buildOptionGroups($this, $optGroups, index);
        } else {
            let $options = $this.find('option').toArray();
            buildOptions($this, $options);
        }


        let isSearch = $this.hasClass('search');

        if (isSearch) {
            buildSearch($this, index);
        }
    });


    function buildOptions($select, $options) {

        $options.forEach(function(item) {
            let optionName = $(item).html();

            let optionHtml = `<li class="nm-select__dropdown--option visible" role="none">
                                <a href="#" role="menuitem">${optionName}</a>
                              </li>`;

            $select.find('.nm-select__dropdown--options').append(optionHtml);

        });
    }


    function buildOptionGroups($select, $optionGroups, index) {

        $optionGroups.forEach(function(item) {

            let groupName = $(item).attr('label');

            let groupOptions = $(item).find('option').toArray();

            let optionsHtml = '';

            groupOptions.forEach(function(option) {
                let optionName = option.innerHTML;
                let optionHtml = `<li class="nm-select__dropdown--option" role="none">
                                    <a href="#" role="menuitem">${optionName}</a>
                                  </li>`;
                optionsHtml = optionsHtml.concat(optionHtml);
            });

            let optGroupHtml = `<li class="nm-select__dropdown--submenu visible" role="none">
                                    <a href="#" class="nm-select__btn--category" role="menuitem" data-category="nm-select--${index}">${groupName}</a>
                                    <ul class="nm-select__dropdown--submenu-options" role="menu">${optionsHtml}</ul>
                                </li>`;

            $select.find('.nm-select__dropdown--options').append(optGroupHtml);

        });
    }


    function buildSearch($selector, index) {
        let searchHtml = `<div class="nm__select--dropdown--search">
                                <input type="text" data-search="nm-select--${index}"><i class="fas fa-search"></i>
                          </div>`;

        $selector.find(`#nm-select--${index} .nm-select__dropdown--menu`).prepend(searchHtml);
    }


    function buildSelectButtonName($select) {

        let buttonName = $select.find('label').html();

        // todo: Set first option as select button name
        if (buttonName === undefined) {

        }

        return buttonName;
    }

    /* BUILD SELECT END */

    /* OPEN/CLOSE MENU AND SUBMENUS */

    // Toggle dropdown
    $('.nm-select__btn').click(function(){
        toggleDropdown($(this));
    });

    // Toggle submenu
    $('.nm-select__btn--category').click(function(e) {
        toggleSubmenu($(this), e);
    });

    function toggleDropdown($selector) {

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
            navigateToSelectedOption();
            clearSearchInput();

        }

        if (optionsStored === undefined) {
            initSelectOptions($activeSelectDropdown);
        } else {
            options = optionsStored;
        }

    }

    function toggleSubmenu($selector, event) {
        let $submenu = $selector.siblings('.nm-select__dropdown--submenu-options');
        let $btnCategory = $('.nm-select__btn--category');

        if ($submenu.hasClass('open')) {
            $submenu.children('li').removeClass('visible')
            $submenu.removeClass('open');
            $submenu.hide();
        } else {
            $btnCategory.siblings('ul').removeClass('open');
            $btnCategory.siblings('ul').children('li').removeClass('visible');
            $btnCategory.siblings('ul').hide();
            $submenu.children('li').addClass('visible');
            $submenu.addClass('open');
            $submenu.show();
        }

        initSelectOptions($('#' + activeSelectId));

        event.preventDefault();
        event.stopPropagation();
    }

    /* OPEN/CLOSE MENU AND SUBMENUS END */

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

    /* SELECT OPTIONS */

    // Select option
    $('.nm-select__dropdown--option').on('click keypress', function(e) {
        toggleOption($(this), e);
    });

    // Mark as highlighted
    $('a[role="menuitem"]').hover(function() {
        highlightSelection($(this));
    });

    $('input[data-search]').focus(function() {
        optionsToSearch = $activeSelectDropdown.find('li.visible').children('a').toArray();
        optionsStored = options;
    });

    $('input[data-search]').keyup(function() {
        searchOption($(this));
    })


    function toggleOption($selector, event) {
        if(event.type === 'click' || (event.type === 'keydown' && event.keyCode === 13) ){

            if ($activeSelect.attr('multiple')) {
                if ($selector.children('a').hasClass('selected')) {
                    unselectOption($selector, event);
                } else {
                    selectOption($selector, event);
                }
            } else {
                selectOption($selector, event);
            }

        }

        // todo: Just for testing
        console.log(100, $activeSelect[0].selectedOptions);
    }


    function selectOption($selector, event) {
        let $selectedOption = $selector.children('a');
        let optionName = $selectedOption.html();

        markOptionAsSelected($activeSelect, optionName);

        if(!$activeSelect.attr('multiple')) {
            $('.nm-select__dropdown--option a').removeClass('selected');
            closeAllDropdowns();
        }

        $selectedOption.addClass('selected');

        updateButtonName();
        event.preventDefault();
        event.stopPropagation();
    }


    function unselectOption($selector, event) {
        let $selectedOption = $selector.children('a');
        let optionName = $selectedOption.html();
        $selectedOption.removeClass('selected');

        unmarkOptionAsSelected(optionName);
        updateButtonName();
        event.preventDefault();
        event.stopPropagation();
    }


    function markOptionAsSelected(select, selectedOption) {

        let selectOptions = $(select).find('option').toArray();

        // todo: Try simplify - add attr in for loop?
        if(isMultipleSelect === undefined) {
            selectOptions.forEach(function(item) {
                $(item).removeAttr('selected');
                if($(item).html() === selectedOption) {
                    $(item).attr('selected', 'selected');
                }
            });
        }

        for (let i = 0; i < activeSelectOptions.length; i++) {
            if (activeSelectOptions[i].text === selectedOption) {
                activeSelectOptions[i].selected = true;
            }
        }
    }


    function unmarkOptionAsSelected(selectedOption) {
        for (let i = 0; i < activeSelectOptions.length; i++) {
            if (activeSelectOptions[i].text === selectedOption) {
                activeSelectOptions[i].selected = false;
            }
        }
    }


    function updateButtonName() {
        let selectedOptions = $activeSelectDropdown.find('a.selected').toArray();
        let newButtonName = "";

        // todo: Find different way to build string!
        if (Array.isArray(selectedOptions) && selectedOptions.length) {
            for(let i = 0; i < selectedOptions.length; i++) {
                newButtonName = newButtonName.concat(selectedOptions[i].innerHTML);

                if (i < selectedOptions.length - 1) {
                    newButtonName = newButtonName.concat(", ");
                }

            }
        } else {
            newButtonName = $activeSelectLabel;
        }

        $activeSelectButton.find('span.nm-select__btn--name').html(limitButtonName(newButtonName, buttonNameLimit[activeSelectColSpan]));
    }


    function limitButtonName(name, limit = 20) {
        const newName = [];
        if (name.length > limit) {
            name.split(' ').reduce((acc, cur) => {
                if (acc + cur.length <= limit) {
                    newName.push(cur);
                }
                return acc + cur.length;
            }, 0);
            return `${newName.join(' ')} ...`;
        }
        return name;
    }


    function navigateToSelectedOption() {
        let optionGroups = $activeSelect.find('optgroup');
        let $selectedOption = $activeSelectDropdown.find('.selected');

        if (optionGroups.length > 0) {

        }

        if ($selectedOption !== undefined) {
            $selectedOption.focus();
        }
    }


    function highlightSelection($selector) {
        $('a[role="menuitem"]').removeClass('highlighted');
        $selector.addClass('highlighted');
        setSelectIndex('.highlighted');
        $('.highlighted').focus();
    }


    function searchOption($input) {
        let searchedValue = $($input).val().toUpperCase();

        // // Clear the options list in DOM
        // $activeSelectDropdown.find('.nm-select__dropdown--options').html('');

        if (searchedValue === "") {
            options = optionsStored;
        } else {
            options = [];

            optionsToSearch.forEach(function(element) {
                let elementValue = element.innerHTML.toUpperCase();

                if(elementValue.startsWith(searchedValue)) {
                    options.push(element);
                }
            });
        }

        // buildOptions($activeSelectDropdown, options);
        //
        // // Bind events to select options
        // $('.nm-select__dropdown--option').on('click keypress', function(e) {
        //     toggleOption($(this), e);
        // });

        clearDropdownAndBuildOptions();
    }


    function clearDropdownAndBuildOptions() {
        // Clear the options list in DOM
        $activeSelectDropdown.find('.nm-select__dropdown--options').html('');

        buildOptions($activeSelectDropdown, options);

        // Bind events to select options
        $('.nm-select__dropdown--option').on('click keypress', function(e) {
            toggleOption($(this), e);
        });
    }


    function clearSearchInput() {
        $('input[data-search]').val("");
    }

    /* SELECT OPTIONS END */

    /* KEYBOARD NAVIGATION */

    // Move with arrows between options
    $('.nm-select__dropdown').on('keydown', function(e) {

        if(keyCodes.includes(e.keyCode)) {
            if (e.keyCode === 40) {
                if (selectIndex === undefined || selectIndex === null) {
                    selectIndex = 0;
                } else if(selectIndex < options.length - 1) {
                    selectIndex++
                }
            } else if (e.keyCode === 38) {
                if (selectIndex > 0) {
                    selectIndex--;
                }
            } else if (e.keyCode === 36) {
                selectIndex = 0;
            } else if (e.keyCode === 35) {
                selectIndex = options.length - 1;
            }
            highlightSelection($(options[selectIndex]));
            e.preventDefault();
            e.stopPropagation();
        }

    });


    function setSelectIndex(selector) {
        selectIndex = options.indexOf($(selector).get(0));
    }

    function initSelectOptions(selector) {
        $('a[role="menuitem"]').removeClass('highlighted');
        options = selector.find('li.visible').children('a').toArray();
    }

    /* KEYBOARD NAVIGATION END */

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


    function closeAllDropdowns() {
        $('.nm-select__dropdown').removeClass('open');
        $('.nm-select__dropdown--menu').hide();


    }

    /* CLOSING ACTIONS END */

});