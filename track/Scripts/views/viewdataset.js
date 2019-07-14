﻿
// - Init Form --------------------------------------------------

// Datetime Select
var datetimeChanged = false;
var focusValue;
$('#datasetSelect').focus();

$('#datetimeSelect').datetimepicker();

$('#datetimeSelect').val(moment(new Date()).format("MM/DD/YYYY h:mm A"));
refreshTime();



// - Form Event -------------------------------------------------

// Datetime Select
$('#datetimeSelect').focus(function (e) {
    focusValue = $(this).val();
})
$('#datetimeSelect').focusout(function (e) {
    if (focusValue != null && $(this).val() != focusValue) {
        datetimeChanged = true;
    }
    focusValue = null;
});

// Add Record Button
$('#addRecord').click(function (e) {
    var datasetId = $('#datasetSelect').val();
    var datetime = $('#datetimeSelect').val();
    var labels = [];
    var values = [];

    // Use current time is input in unchanged
    var now = new Date();
    if (datetime == moment(now).format("MM/DD/YYYY h:mm A")) {
        datetime = moment(now).format("MM/DD/YYYY hh:mm:ss a");
    }

    var formProps = $('#createRecord .form-props .form-group');

    for (var i = 0; i < formProps.length; i++) {
        var label = $('label', formProps[i]).html();
        var value = $('.form-control', formProps[i]).val();
        $('.form-control', formProps[i]).val('');

        labels.push(label);
        values.push(value);
    }

    // Grab note value & clear
    var note = $('#noteTextarea').val();
    $('#noteTextarea').val('');

    var data = {
        "datasetid": datasetId,
        "datetime": datetime,
        "labels": labels,
        "values": values,
        "note": note
    };

    // Update remote
    $.post('/Home/CreateRecord', data);

    // Update local
    currentDataset.records.push(data.datetime);
    for (var i in labels) currentDataset.properties[data.labels[i]].push(data.values[i]);
    currentDataset.notes.push(data.note);

    // Update view
    refreshChart(currentDataset, $('.ct-chart'));

    return false;
});




// - Page Functions ---------------------------------------------

// Refresh Create Record Form DateTime field
function refreshTime() {

    var now = moment(new Date()).format("MM/DD/YYYY h:mm A");

    if (focusValue == null && !datetimeChanged && $('#datetimeSelect').val() != now) {
        $('#datetimeSelect').val(now);
    }

    setTimeout(refreshTime, 1000);
}

// Refresh Create Record Form
function refreshForm(dataset) {

    var html = '';

    for (var i = 0; i < dataset.series.length; i++) {
        // Add series field
        html += '<div class="form-group"><label>' + dataset.series[i].Label + '</label><input type="number" class="form-control" id="prop-' + i + '"></div>';
    }

    $('#createRecord .form-props').html(html);
}

// Refresh Chart
function refreshChart(dataset, $chart) {

    // Create Chartist data object
    var data = {
        //labels: []
        series: []
    }

    // Chartist data
    if (dataset != null) {

        // Populate first data object
        for (var i = 0; i < dataset.series.length; i++) {

            data.series.push({
                name: dataset.series[i].Label,
                data: []
            });

            for (var j = 0; j < dataset.records.length; j++) {
                data.series[i].data.push({
                    // Note
                    meta: (dataset.notes[j] == null) ? '' : dataset.notes[j],
                    // DateTime
                    x: new Date(dataset.records[j]),
                    // Value
                    y: dataset.properties[dataset.series[i].Label][j]
                });
            }
        }
    }

    var span = parseInt(dataset.span);

    // Chartist options
    var options = {
        axisX: {
            type: Chartist.FixedScaleAxis,
            divisor: Math.round(Math.max(1, parseInt(dataset.span) / 30)),
            labelInterpolationFnc: function (value) {
                return moment(value).format('MMM');
            }
        },
        chartPadding: {
            left: 0,
            //right: 20
        },
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip({
                tooltipOffset: {
                    x: $('.scroll')[0].scrollLeft,
                },
                transformTooltipTextFnc: function (val) {

                    var coords = val.split(',');
                    val = coords[0] + ' - ' + coords[1];

                    return val;
                }
            })
        ],
        showGridBackground: false
    };

    //console.log("span: " + span + "; w: " + span * 2 + "; cw: " + $('.scroll')[0].clientWidth + "; d:" + Math.max(1, span / 30));

    // Resize Chart
    if (span) {
        if (span * 2 < $('.scroll')[0].clientWidth) {
            $chart.css('width', $('.scroll')[0].clientWidth);
        } else {
            $chart.css('width', span * 2);
        }
    } else {
        $chart.css('width', $('.scroll')[0].clientWidth);
    }


    // Render new graph
    if (!chart) {
        chart = new Chartist.Line('.' + $chart.prop('class'), data, options);
    } else {
        chart.update(data, options);
    }

    // Move vertical labels
    $.each($('#chart-labels g').children(), function (i, val) {
        $(val).remove();
    })
    checkLabels();

    // Update chart colors
    var sp = 'abcdefghij';
    var css = '';
    for (var s in dataset.series) {
        var prefix = sp.substr(s, 1);
        css += '.ct-series-' + prefix + ' .ct-point, .ct-series-' + prefix + ' .ct-line { stroke: #' + dataset.series[s].Color + '; }';
    }
    $('style#dynamic').html(css);

    // Scroll chart to right edge
    $('.scroll')[0].scrollLeft = $('.scroll')[0].scrollWidth - $('.scroll')[0].clientWidth;
}


// Check is vertical Chart labels have appeared
function checkLabels() {

    var vertLabels = $('.ct-start').parent();
    $.each($(vertLabels), function (id, value) {
        $(value).attr('y', parseInt($(value).attr('y')) + 20);
    });

    if (!vertLabels.length) {
        setTimeout(checkLabels, 100);
    } else {
        $('#chart-labels g').append($(vertLabels));
    }
}