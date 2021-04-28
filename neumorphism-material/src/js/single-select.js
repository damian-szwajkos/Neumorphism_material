export class SingleSelect {

    constructor(element, index) {
        this.element = element;
        this.options = element.querySelectorAll('option');
        buildSingleSelect(index);
    }




}

function buildSingleSelect(index) {

    // let $this = this;
    //
    // $this.find('select').attr('data-select', 'nm-select--' + index);



    let dropdownHtml = `<div class="nm-select__dropdown" id="nm-select--${index}">
                                <div class="nm-select__btn" role="button">
                                    <span class="nm-select__btn--name">${this.buildSelectButtonName(this)}</span>
                                    <span class="nm-select__btn--caret"></span>
                                </div>
                                <div class="nm-select__dropdown--menu">
                                    <ul class="nm-select__dropdown--options" role="menu"></ul>
                                </div>
                            </div>`;

}

function buildSelectButtonName(element) {

}
