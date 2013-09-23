/**
 * HATCHD DIGITAL RESPONSIVE TABLES
 *
 * Responsive tables modifies the appearance of tables down to smaller
 * device sizes, by hiding non-essential columns and feeding the hidden data
 * into a subsequent row that can be shown on click.
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au/
 *
 * FOR DEVELOPERS:
 *
 * The code in this file should always be well formatted and never be
 * used in production systems. Your site should always use disc/*-.min.js
 * which contains a packed and minified version of the script
 * prepended with all dependencies.
 *
 * REQUIRED FRAMEWORKS
 *
 * @required jquery (v1.8.0+)
 * -- (http://jquery.com)
 *
 * VALIDATION
 *
 * All code must validate with JSHint (http://www.jshint.com/) before
 * commiting this repo. NO debug code should remain in your final
 * versions. Ensure to remove every reference to console.log.
 *
 * STYLE
 *
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * CONTRIBUTORS
 *
 * @author Jimmy Hillis <jimmy@hatchd.com.au>
 * @author Niaal Holder <niaal@hatchd.com.au>
 *
 */

/* global define */

(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else {
        // Browser globals
        window.Slide = factory(window.jQuery);
    }

}(function ($) {

    var ResponsiveTable = function (element) {
        var that = this;

        this.$element = $(element);
        this.row_headings = this.$element.find('thead th');
        this.row_cells = this.$element.find('td');
        this.dataTemplate = Handlebars.compile(
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
        this.current = null;
        this.$element.find('tbody tr').on('click', function () {
            that.rowSwapCallback(this);
        });

        // check that number of heading columns matches row columns
        if (this.row_headings.length !== this.row_cells.length) {
            return;
        }

        return this;
    };

    /**
     * Shows/hides an additional row in the table on click, using data taken
     * from the table cells hidden at responsive device widths. Behaviour
     * changes depending on whether any rows have already been clicked.
     *
     * @param  {string} row The clicked row
     * @return null
     */
    ResponsiveTable.prototype.rowSwapCallback = function (row) {
        var $row = $(row);
        var row_values = $row.find('td');
        var data = [];

        // add heading and value pairs to data array
        for (var i = 0; i < row_values.length; i++) {
            if ($(row_values[i]).hasClass('opt')) {
                data.push({
                    'heading': $(this.row_headings[i]).text(),
                    'value': $(row_values[i]).text()
                });
            }
        }

        // swap the open/closed indicator depending on state
        if ($row.hasClass('state-open')) {
            $row.removeClass('state-open').addClass('state-closed');
        }
        else {
            this.$element.find('tr.state-open').removeClass('state-open').addClass('state-closed');
            $row.removeClass('state-closed').addClass('state-open');
        }

        // clear the panel if user clicks the already selected row
        if (this.current) {
            this.current.detail.remove();
        }

        // set the clicked row as the stored 'current' row
        if (this.current !== row) {
            this.current = row;
            if (this.current.detail === undefined) {
                this.current.detail = $(this.dataTemplate(data));
                this.current.detail.find('td').prop('colspan', data.length);
            }
            $(this.current).after(this.current.detail);
        }
        else {
            this.current = null;
        }

    };

    $.fn.responsiveTable = function (options) {
        options = $.extend({
            'defaultSomething': true
        }, options);
        return $(this).each(function () {
            var table = new ResponsiveTable(this);
        });
    };

    return $.fn.responsiveTable;

 }));
