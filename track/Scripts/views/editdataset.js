
// Save dataset updates
$('#save-tab').on('click', function () {
    editDataset();
})

// Update changed input
$('#editDataset [name]').on('change', function () {
    $(this).addClass('changed');
})

// Update color input/display
$('#editDataset [name=color]').change(function (e) {
    updateColor(e);
});

// Forms JSON based on changed inputs and post to home controller
function editDataset() {
    var datasetLabel, propIds = [], propLabels = [], propColors = [];

    if ($('#edit-datasetLabel').hasClass('changed'))
        datasetLabel = $('#edit-datasetLabel').val();

    $.each($('#editDataset .form-props .form-row'), function () {
        if ($(this).has('.changed').length) {
            propIds.push($('[name=id]', this).val());
            propLabels.push($('[name=label]', this).val());
            propColors.push($('[name=color]', this).val());
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
        refreshDatasetOptions($('#datasetSelect'), id);
    })
}

// Grabs color value from input & updates color display
function updateColor(e) {
    var $row = $(e.target).closest('.form-row');
    $('.color-display', $row).css('background-color', '#' + $(e.target).val());
}