
// Save Tab
$('#save-tab').on('click', function () {
    createDataset();
})

// Add Property button
$('#createAddProperty').on('click', function () {
    showProperty();
})

// Remove Property buttons
$('#create-dataset button.remove').click(function (e) {
    hideProperty(e.target);
});

function createDataset() {

    var propLabels = [], propTypes = [];

    var form = $('#create-dataset').serializeArray();
    var datasetLabel = form[0].value;

    $.each(form, function (i, val) {
        if (val.name == 'label') propLabels.push(val.value);
        if (val.name == 'type') propTypes.push(val.value);
    })

    var data = {
        datasetLabel: datasetLabel,
        labels: propLabels,
        types: propTypes
    };

    $.ajax({
        type: 'POST',
        url: '/Home/CreateDataset',
        traditional: true,
        data: data
    })
        .done(function (id) {
            // Update select and focus new value
            refreshDatasetOptions($('#datasetSelect'), id);
        })
}

function showProperty() {
    var $row = $('#create-dataset .form-props .form-row:hidden').first();

    $row.removeAttr('hidden');
    $(':disabled', $row).removeAttr('disabled');

    if ($row.is($('#create-dataset .form-props .form-row').last())) $('#createAddProperty').hide();
}

function hideProperty(target) {
    var $row = $(target).closest('.form-row');

    $row.attr('hidden', true);
    $('input, select', $row).attr('disabled', true);

    $('#createAddProperty').show();
}