const {initCheckBoxes} = require("./checkboxes");
const {initDatepicker} = require("./datepicker");
const {initForms} = require("./forms");
const {initSelects} = require("./selects");
const {initTimepicker} = require("./timepicker");
const {initTooltips} = require("./tooltips");

$(document).ready(function() {
    initCheckBoxes();
    initDatepicker();
    initForms();
    initSelects();
    initTimepicker();
    initTooltips();
});
