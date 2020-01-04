
// Save dataset updates
$('#save-tab').on('click', function () {
    editDataset();
})

// Update changed input
$('#editDataset [name]').on('change', function () {
    $(this).addClass('changed');
})

// Update color input/display
$('#editDataset [name=color]').change(updateColor);

// Forms JSON based on changed inputs and post to home controller
function editDataset() {
    const $datasetLabel = $('#editDataset [name=dataset-label]');
    const $datasetProperties = $('#editDataset .form-props .form-row');

    var datasetLabel, propIds = [], propLabels = [], propColors = [];

    if ($datasetLabel.hasClass('changed')) datasetLabel = $datasetLabel.val();

    $.each($datasetProperties, function () {
        if ($(this).has('.changed').length) {
            propIds.push($('[name=id]', this).val());
            propLabels.push($('[name=label]', this).val());
            propColors.push($('[name=color]', this).val());
        }
    });


    var dataset = {
        Label: datasetLabel || ''
    };

    $.ajax({
        type: "patch",
        async: false,
        contentType: 'application/json',
        url: `https://localhost:44311/odata/Datasets(${currentDataset.Id})`,
        data: JSON.stringify(dataset),
        dataType: 'json',
        success: () => refreshDatasetOptions(),
        error: function (xhr, textStatus, errorMessage) {
            console.log('error', xhr, textStatus, errorMessage);
        }
    });

    var updatesLeft = propLabels.length;

    for (var i in propIds) {
        var series = {
            DatasetId: currentDataset.Id,
            Label: propLabels[i] || '',
            Color: propColors[i] || null
        };

        $.ajax({
            type: "patch",
            async: false,
            contentType: 'application/json',
            url: `https://localhost:44311/odata/Series(${propIds[i]})`,
            data: JSON.stringify(series),
            dataType: 'json',
            success: () => {
                if (--updatesLeft <= 0) updateDataset();
            },
            error: function (xhr, textStatus, errorMessage) {
                console.log('error', xhr, textStatus, errorMessage);
            }
        });
    }
}

// Grabs color value from input & updates color display
function updateColor(e) {
    var $row = $(e.target).closest('.form-row');
    $('.color-display', $row).css('background-color', '#' + $(e.target).val());
}