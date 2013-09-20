$(document).ready(function () {

    //responsive table detail show/hide
    var headings = $('thead th');
    var tbody = $('tbody');
    var rowSwapCallback;
    var dataTemplate = Handlebars.compile(
        '<tr class="row-detail">' +
            '<td>' +
                '<dl>' +
                    '{{#.}}' +
                    '<dt>{{heading}}</dt>' +
                    '<dd>{{value}}</dd>' +
                    '{{/.}}' +
                '</dl>' +
            '</td>' +
        '</tr>');
    var current;

    rowSwapCallback = function () {
        var values = $(this).find('td');
        var data = [];

        // check that number of heading columns matches row columns
        if (headings.length !== values.length) {
            return;
        }

        // add heading and value pairs to data array
        for (var i = 0; i < values.length; i++) {
            if ($(values[i]).hasClass('opt')) {
                data.push({
                    'heading': $(headings[i]).text(),
                    'value': $(values[i]).text()
                });
            }
        }

        // swap the open/closed indicator depending on state
        if ($(this).hasClass('state-open')) {
            $(this).removeClass('state-open').addClass('state-closed');
        }
        else {
            $('.responsive-table tr').removeClass('state-open').addClass('state-closed');
            $(this).removeClass('state-closed').addClass('state-open');
        }

        // clear the panel if click hits the already selected row
        if (current) {
            current.detail.remove();
        }

        // set the clicked row as the stored current row
        if (current !== this) {
            current = this;
            if (current.detail === undefined) {
                current.detail = $(dataTemplate(data));
                current.detail.find('td').prop('colspan', data.length);
            }
            $(current).after(current.detail);
        }
        else {
            current = null;
        }

    };

    $('.responsive-table tbody tr').on('click', rowSwapCallback);

 });
