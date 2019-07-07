
// Update changed input
$('#editDataset [name]').on('change', function () {
    $(this).addClass('changed');
})

// Update color input/display
$('#editDataset [name=color]').change(function (e) {
    updateColor(e);
});

// Save dataset updates
$('#save-tab').on('click', function () {
    editDataset();
})

// Forms JSON based on changed inputs and post to home controller
function editDataset() {
    var datasetLabel, propIds = [], propLabels = [], propColors = [];

    if ($('#edit-datasetLabel').hasClass('changed'))
        datasetLabel = $('#edit-datasetLabel').val();

    $.each($('#editDataset .form-props .form-row'), function (index, value) {
        if ($(this).has('.changed').length) {
            propIds.push($('[name=id]', value).val());
            propLabels.push($('[name=label]', value).val());
            propColors.push($('[name=color]', value).val());
        }
    });

    var data = {
        datasetId: $('#editDataset [name=dataset-id]').val(),
        datasetLabel: datasetLabel,
        propIds: propIds,
        propLabels: propLabels,
        propColors: propColors
    }


    // Update remote
    $.post('/Home/UpdateDataset', data, function (id) {
        // TODO: remove view coupling
        if (datasetLabel) refreshDatasetOptions($('#datasetSelect'), id);

        // TODO: this will not update chart colors!!
    })
}

// Grabs color value from input & updates color display
function updateColor(e) {
    var $row = $(e.target).closest('.form-row');
    $('.color-display', $row).css('background-color', '#' + $(e.target).val());
}