
// Save dataset updates
$('#save-tab').on('click', function () {
    editDataset();
})

//$('#archiveDataset').on('click', (e) => {
//    var dataset = {
//        Archived: true
//    };
//    $.ajax({
//        type: "patch",
//        async: false,
//        contentType: 'application/json',
//        url: `https://localhost:44311/odata/Datasets(${currentDataset.Id})`,
//        data: JSON.stringify(dataset),
//        dataType: 'json',
//        success: () => {
//            console.log($)
//            refreshDatasetOptions();
//            $('a', $cancelTab).trigger('click');
//        },
//        error: function (xhr, textStatus, errorMessage) {
//            console.log('error', xhr, textStatus, errorMessage);
//        }
//    });
//});

// Update changed input
$('#editDataset [name]').on('change', function () {
    $(this).addClass('changed');
})

// Update color input/display
$('#editDataset [name=color]').change(updateColor);

function updateColor(e) {
    var $row = $(e.target).closest('.form-row');
    $('.color-display', $row).css('background-color', '#' + $(e.target).val());
}

// Forms JSON based on changed inputs and post to home controller
function editDataset() {
    const $datasetLabel = $('#editDataset [name=dataset-label]');
    const $datasetProperties = $('#editDataset .form-props .form-row');

    if ($datasetLabel.hasClass('changed')) {
        var dataset = {
            Label: $datasetLabel.val()
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
    }


    var updatesLeft = 0;

    $.each($datasetProperties, function () {
        if ($(this).has('.changed').length) {
            updatesLeft++;

            var seriesId = $('[name=id]', this).val();
            var series = {
                DatasetId: currentDataset.Id,
                Label: $('[name=label]', this).val(),
                Color: $('[name=color]', this).val() || null
            };

            $.ajax({
                type: "patch",
                async: false,
                contentType: 'application/json',
                url: `https://localhost:44311/odata/Series(${seriesId})`,
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
    });
}