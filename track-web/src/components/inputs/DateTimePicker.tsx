import moment from 'moment';
import * as React from 'react';
import { useState } from 'react';
import DateTime from 'react-datetime';

type DateTimePickerProps = {
  date: Date;
  updateDate: Function;
  autoUpdate?: boolean;
  disabled?: boolean;
  dateFormat?: string;
  timeFormat?: string;
};

const DateTimePicker: React.FunctionComponent<DateTimePickerProps> = ({
  date,
  updateDate,
  disabled,
  autoUpdate = true,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'h:mm:ss a'
}) => {

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (autoUpdate == true) {
  //       updateDate(new Date());
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const [valid, setValid] = useState<boolean>(true);

  const handleDateUpdate = (m: string) => {
    const date = moment(m);
    if (date.isValid()) {
      updateDate(date.toDate());
      if (!valid) setValid(true);
    }
  }

  const handleOnBlur = (dateString: string) => {
    if (!moment(dateString).isValid()) {
      setValid(false);
    } else if (!valid) {
      setValid(true);
    }
  }

  return (
    <div className="datetime-picker">
      <DateTime
        onBlur={(m: string) => handleOnBlur(m)}
        onChange={(m: string) => handleDateUpdate(m)}
        inputProps={{ className: valid ? 'form-control' : 'form-control is-invalid', disabled }}
        value={date}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
      />
    </div>
  );
}

export default DateTimePicker;