var Utils = (function () {

    return {


        populate: function (count, days = 1, delay = 1000) {

            var props = $('input[id^=prop]');

            // Couldn't find property inputs
            if (!props.length) {
                console.log('populate failed');
                return false;
            }

            // Init populate
            submitProps(moment(), 0, count);


            function submitProps(moment, i, max) {

                var dateText = moment.clone().add((i * days), 'days').format('MM/DD/YYYY hh:mm A');

                // Populate record props & date
                $.each(props, function (key, val) {
                    $(val).val(Math.floor(Math.random() * 1000));
                })
                $('#datetimeSelect').val(dateText);

                // Submit record
                $('#addRecord').click();

                // Output update
                console.log(i + ' - ' + dateText);

                if (i + 1 < max) setTimeout(function () {
                    submitProps(moment, i + 1, max);
                }, delay);
            }

        }

    }

}())