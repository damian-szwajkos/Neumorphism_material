// TODO: NAMING CONVENTIONS    nm__block__element--modifier
//                             nm__block-name__element--modifier ex. nm__select-dropdown__menu
//                             names are separate just with single -



// TODO:
// 1. Add WCAG attributes - for inputs also
//    1.A Mark as expanded and collapsed - add hidden span
// 2. For simple select add search by typing first letter of option - navigate to that option
// 3. Select option by ENTER
// 4. Close select by ESC
// 5. Add search option - Add class ex. nm-search - When class added append input to dropdown
// 6. Multiple select changes - Choosen values should appear on select button


let options;
let selectIndex;
const keyCodes = [35, 36, 38, 40];

$(document).ready(function() {


    $('.nm-select').each(function(index) {

        let $this = $(this);

        // Add special attribute to select
        $this.find('select').attr('data-select', 'nm-select--' + index);

        // Build button name ?
        let buttonName = $this.find('label').html();

        let dropdownHtml = `<div class="nm-select__dropdown" id="nm-select--${index}">
                                <button class="nm-select__btn">${buttonName}<span class="nm-select__btn--caret"></span></button>
                                <div class="nm-select__dropdown--menu">
                                    <ul class="nm-select__dropdown--options" role="menu"></ul>
                                </div>
                            </div>`;


        $this.append(dropdownHtml);

        let isSearch = $this.hasClass('search');

        if (isSearch) {
            let searchHtml = `<div class="nm__select--dropdown--search">
                                <input type="text"><i class="fas fa-search"></i>
                              </div>`;
        }


        let $optGroups = $this.find('select').find('optgroup').toArray();

        if ($optGroups.length > 0) {
            buildOptionGroups($this, $optGroups, index);
        } else {
            buildOptions($this);
        }

    });


    function buildOptions($select) {

        let $options = $select.find('option').toArray();

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
                let optionHtml = `<li class="nm-select__dropdown--option" role="none"><a href="#" role="menuitem">${optionName}</a></li>`
                optionsHtml = optionsHtml.concat(optionHtml);
            });

            let optGroupHtml = `<li class="nm-select__dropdown--submenu visible" role="none">
                                    <a href="#" class="nm-select__btn--category" role="menuitem" data-category="nm-select--${index}">${groupName}</a>
                                    <ul class="nm-select__dropdown--submenu-options" role="menu">${optionsHtml}</ul>
                                </li>`;

            $select.find('.nm-select__dropdown--options').append(optGroupHtml);

        });

    }


    $('.nm-select__btn--category').click(function(e) {
        let $submenu = $(this).siblings('.nm-select__dropdown--submenu-options');

        if ($submenu.hasClass('open')) {
            $submenu.children('li').removeClass('visible')
            $submenu.removeClass('open');
            $submenu.hide();
        } else {
            $('.nm-select__btn--category').siblings('ul').removeClass('open');
            $('.nm-select__btn--category').siblings('ul').children('li').removeClass('visible');
            $('.nm-select__btn--category').siblings('ul').hide();
            $submenu.children('li').addClass('visible');
            $submenu.addClass('open');
            $submenu.show();
        }

        let selectIndex = $(this).attr('data-category');

        initSelectOptions($('#' + selectIndex));

        e.preventDefault();
        e.stopPropagation();
    });


    // Select option
    $('.nm-select__dropdown--option').on('click keypress', function(e) {
        if( e.type === 'click' || (e.type === 'keydown' && e.keyCode === 13) ){
            selectOption($(this), e);
        }
    });


    function selectOption(selector, event) {
        let $select = $('.nm-select__dropdown.open').siblings('select');
        let $selectedButton = $('.nm-select__dropdown.open > .nm-select__btn');
        let $selectedOption = selector.children('a');
        let $caret = $selectedButton.find('nm-select__btn--caret');
        let optionValue = $selectedOption.attr('value');
        let optionName = $selectedOption.html();

        if(!$select.attr('multiple')) {
            $('.nm-select__dropdown--option a').removeClass('selected');
        }

        $selectedOption.addClass('selected');

        $selectedButton.attr("value", optionValue);
        $selectedButton.html(optionName);
        $selectedButton.append($caret);

        markOptionAsSelected($select, optionName);

        if(!$($select).attr('multiple')) {
            closeDropdown();
        }

        event.preventDefault();
        event.stopPropagation();
    }


    function markOptionAsSelected(select, selectedOption) {

        let selectOptions = $(select).find('option').toArray();

        selectOptions.forEach(function(item) {
            $(item).removeAttr('selected');
            if($(item).html() === selectedOption) {
                $(item).attr('selected', 'selected');
            }
        });

    }


    // Toggle dropdown
    $('.nm-select__btn').click(function(){
        toggleDropdown($(this));
    });


    function toggleDropdown($selector) {

        if ($selector.parent('.nm-select__dropdown').hasClass('open')) {
            $selector.parent('.nm-select__dropdown').removeClass('open');
            $selector.find('.nm__btn--caret').css('transform', 'rotate(180deg)');
            $selector.siblings('.nm-select__dropdown--menu').hide();
        } else {
            closeDropdown();
            $selector.parent('.nm-select__dropdown').addClass('open');
            $selector.find('.nm__btn--caret').css('transform', 'rotate(180deg)');
            $selector.siblings('.nm-select__dropdown--menu').show();
        }

        // todo: Refactor needed
        initSelectOptions($selector.parent('.nm-select__dropdown'));
    }


    // Mark as highlighted
    $('a[role="menuitem"]').hover(function() {
        highlightSelection($(this));
    });


    function highlightSelection($selector) {
        $('a[role="menuitem"]').removeClass('highlighted');
        $selector.addClass('highlighted');
        setSelectIndex('.highlighted');
        $('.highlighted').focus();
    }


    // Close all dropdowns
    function closeDropdown() {
        $('.nm-select__dropdown').removeClass('open');
        $('.nm-select__dropdown--menu').hide();
    }

    // Close dropdown after click at document
    $(document).click(function(e) {
       if(!$(e.target).hasClass('nm-select__btn')) {
           closeDropdown();
       }
    });


    // Move with arrows between options
    $('.nm-select__dropdown').on('keydown', function(e) {

        if(keyCodes.includes(e.keyCode)) {
            // Move down
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


    function navigateToSelectedOption() {
        let $selectedOption = $('.selected');
    }


    function setSelectIndex(selector) {
        selectIndex = options.indexOf($(selector).get(0));
    }


    function initSelectOptions(selector) {
        options = selector.find('li.visible').children('a').toArray();
        console.log(200, options);
    }


    // Close when ESC
    $(document).keydown(function(e) {
       if(e.keyCode === 27) {
           closeDropdown();
       }
    });


    /* INPUTS */
    $('.nm__form-group input').focus(function() {
        $(this).siblings('label').addClass('focus').removeClass('no-focus');
    });

    $('.nm__form-group input').blur(function() {
        if($(this).val() === "") {
            $(this).siblings('label').addClass('no-focus').removeClass('focus');
        }
    });


});