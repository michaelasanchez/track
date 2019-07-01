
// Add Property Button
$('#createAddProperty').click(function (e) {

    var clone = $('#create-dataset .form-row.init').last().clone();
    console.log(clone);

    var rowCount = $('#create-dataset .form-props > .form-row').length;
    if (rowCount < maxProperties) {

        // Increment clone input ids
        var lastId = $('[id^=label]').attr('id');
        var id = lastId.substr(lastId.length - 1);
        var nextId = parseInt(id) + 1;
        $('[id^=label]', clone).attr('id', 'label-' + nextId);
        $('[id^=label]', clone).val('');

        lastId = $('[id^=type]').attr('id');
        id = lastId.substr(lastId.length - 1);
        nextId = parseInt(id) + 1;
        $('[id^=type]', clone).attr('id', 'type-' + nextId);

        // Button - Remove Row
        $('button.remove', clone).click(function (e) {
            // TODO:  improve this
            if ($(e.target).parent().parent().hasClass('form-row')) {
                $(e.target).parent().parent().remove();
            } else if ($(e.target).parent().parent().parent().hasClass('form-row')) {
                $(e.target).parent().parent().parent().remove();
            }
            if ($('#createAddProperty').css('display') == 'none')
                $('#createAddProperty').show();
        });

        $('#create-dataset .form-props').append(clone);

        // Highlight first empty label
        $('[id^=label]').each(function () {
            if ($(this).val().length == 0) {
                $(this).focus();
                return false;
            }
        })

        if (rowCount + 1 >= maxProperties) {
            $('#createAddProperty').hide();
        }
    }
});


$('#save-tab').on('click', function () {
    createDataset();
})

function createDataset() {

    var datasetLabel = $('#createDatasetLabel').val();

    var propLabels = [];
    var propTypes = [];

    $.each($('input[id^=label]'), function (index, value) {
        propLabels.push($(value).val());
    });
    $.each($('select[id^=type]'), function (index, value) {
        propTypes.push($(value).val());
    });
    console.log(propTypes);

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