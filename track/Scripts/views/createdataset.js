
// Add Property Button
$('#createAddProperty').on('click', function () {
    addProperty();
})

// Save Tab
$('#save-tab').on('click', function () {
    createDataset();
})

function createDataset () {

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

function addProperty () {

    var rowCount = $('#create-dataset .form-props .form-row').length;

    // Hide add property button
    if (rowCount + 1 == maxProperties) $('#createAddProperty').hide();

    // Add property row
    if (rowCount < maxProperties) {

        // Clone form row and reset inputs
        var $clone = $('#create-dataset .form-props .form-row:first-child').clone();
        $('input', $clone).val('');
        $('select', $clone).val(1);

        // Remove Row button
        $('button.remove', $clone).click(function (e) {
            $(this).closest('.form-row').remove();
            $('#createAddProperty').show();
        });

        $('#create-dataset .form-props').append($clone);

        // Highlight first empty label input
        $('#create-dataset [name=label]').each(function () {
            if ($(this).val().length == 0) {
                $(this).focus();
                return false;
            }
        })
    }
}