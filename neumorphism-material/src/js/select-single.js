import {highlightSelection} from "./selects-base";

const {buildOptions} = require("./selects-base");
const {buildSelectButtonName} = require("./selects-base");
const {toggleDropdown} = require('./selects-base');

export function buildSingleSelects() {

    console.log("Single selects ready!");

    $('.nm-select--single').each(function(index) {

        let $this = $(this);

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

        let $options = $this.find('option').toArray();
        buildOptions($this, $options);

    });

    bindEvents();
}

function bindEvents() {

    // Toggle dropdown
    $('.nm-select__btn').click(function(){
        toggleDropdown($(this));
    });

    // Mark as highlighted
    $('a[role="menuitem"]').hover(function() {
        highlightSelection($(this));
    });


    // Toggle dropdown
    // Close all dropdowns
    // Select option
    // Set active element


}

