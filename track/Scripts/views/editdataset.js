
var rowCount = $('#editDataset .form-props > .form-row').length;

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