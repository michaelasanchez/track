
var rowCount = $('#editDataset .form-props > .form-row').length;

$('#editDataset .form-props .form-row:not(.init)').remove();
$('#editDataset .form-props .form-row.init').attr('id', 'prop-' + currentDataset.ids[0]);
$('#editDataset #edit-color-0').val(currentDataset.colors[0]);
$('#editDataset #color-0').css('background-color', '#' + currentDataset.colors[0]);

// Create property rows
for (var i = 1; i < currentDataset.series.length; i++) {
    clone = $('#editDataset .form-row.init').last().clone();
    clone.removeClass('init');

    // Increment clone input ids
    $(clone).attr('id', 'prop-' + currentDataset.ids[i]);
    $('[id^=edit-label]', clone).attr('id', 'edit-label-' + i);
    $('[id^=edit-type]', clone).attr('id', 'edit-type-' + i);
    $('[id^=edit-color]', clone).attr('id', 'edit-color-' + i);
    $('[id^=edit-color]', clone).val(currentDataset.colors[i]);
    $('[id^=color]', clone).attr('id', 'color-' + i);
    $('[id^=color]', clone).css('background-color', '#' + currentDataset.colors[i]);

    $('#editDataset .form-props').append(clone);

    if (rowCount + 1 == maxProperties) {
        $('#editAddProperty').hide();
    }
}

// Populate values
$('#edit-datasetLabel').val(currentDataset.label);
for (var i = 0; i < currentDataset.series.length; i++) {
    $('#editDataset #edit-label-' + i).val(currentDataset.series[i]);
    $('#editDataset #edit-type-' + i + ' option[value=' + currentDataset.types[i] + ']').attr('selected', true);
}

// Input change events
$('[id^=edit-color]').change(function (e) {

    var id = $(e.target).attr('id');


    $('#color-' + id.substr(id.length - 1)).css('background-color', '#' + $(e.target).val());
});
$('#edit-datasetLabel').change(function (e) {
    $(e.target).addClass('is-valid');
});
$('[id^=edit-label]').change(function (e) {
    $(e.target).addClass('is-valid');
});
$('[id^=edit-color]').change(function (e) {
    $(e.target).addClass('is-valid');
});

$('#save-tab').on('click', function () {
    editDataset();
})

function editDataset() {

    var datasetLabel;

    if ($('#edit-datasetLabel').hasClass('is-valid'))
        datasetLabel = $('#edit-datasetLabel').val();

    var propIds = [];
    var propLabels = []
    var propColors = [];

    $.each($('#editDataset .form-props .form-row'), function (index, value) {

        if ($('#edit-label-' + index, value).hasClass('is-valid') || $('#edit-color-' + index).hasClass('is-valid')) {
            var propId = $(value).attr('id');
            propIds.push(propId.substr(propId.indexOf('-') + 1));
            propLabels.push($('#edit-label-' + index, value).val());
            propColors.push($('#edit-color-' + index, value).val());
        }
    });

    var data = {
        datasetId: $('#datasetSelect').val(),
        datasetLabel: datasetLabel,
        ids: propIds,
        labels: propLabels,
        colors: propColors
    }

    $.ajax({
        type: 'POST',
        url: '/Home/UpdateDataset',
        traditional: true,
        data: data
    })
        .done(function () {
            $.get('/Home/GetDataset/' + $('#datasetSelect').val(), function (data) {
                currentDataset = JSON.parse(data);
                refreshForm(currentDataset);
                refreshChart(currentDataset, $('.ct-chart'));

                // Update Dataset Select
                $('#datasetSelect option:selected').html(currentDataset.label);

                // Reset Edit Dataset Form
                $('#editDataset .is-valid').removeClass('is-valid');
            });
        });
}