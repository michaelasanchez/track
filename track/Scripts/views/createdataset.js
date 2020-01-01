
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

// Serialize create dataset form and post to home controller
function createDataset() {
    var form = $('#create-dataset').serializeArray();

    var propLabels = [], propTypes = [];
    $.each(form, function (i, input) {
        if (input.name == 'label') propLabels.push(input.value);
        if (input.name == 'type') propTypes.push(input.value);
    });


    var dataset = {
        User: 1,
        Label: form[0].value
    };

    $.post('https://localhost:44311/odata/Datasets', dataset, (data) => {

        for (var i in propLabels) {
            var series = {
                DatasetId: data.Id,
                TypeId: propTypes[i],
                Label: propLabels[i]
            };
            $.post('https://localhost:44311/odata/Series', series, (data) => {
                //refreshDatasetOptions($('#datasetSelect'), data.Id);
            });
        }
    });
}

// Show/enable next hidden property row.
function showProperty() {
    var $row = $('#create-dataset .form-props .form-row:hidden').first();

    $row.removeAttr('hidden');
    $(':disabled', $row).removeAttr('disabled');

    // Hide Add Property button if necessary
    if ($row.is($('#create-dataset .form-props .form-row').last())) $('#createAddProperty').hide();

    // Focus first empty label input
    $('#create-dataset [name=label]').each(function () {
        if (!$(this).val().length) {
            $(this).focus();
            return false;
        }
    })
}

// Hide/disable last property row.
function hideProperty(target) {
    // TODO: this row will maintain order after removed. (so after re-adding, may appear before other prop rows)
    var $row = $(target).closest('.form-row');

    // Hide, disable & clear inputs
    $row.attr('hidden', true);
    $('input', $row).attr('disabled', true).val('');
    $('select', $row).attr('disabled', true).val(1);

    $('#createAddProperty').show();
}