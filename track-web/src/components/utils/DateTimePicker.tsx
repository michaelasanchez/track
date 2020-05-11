import * as React from 'react';
import DateTime from 'react-datetime';
import moment, { Moment } from 'moment';
import { useState } from 'react';


type DateTimePickerProps = {
  date: Date;
  updateDate: Function;
};

const DateTimePicker: React.FunctionComponent<DateTimePickerProps> = ({ date, updateDate }) => {
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
        inputProps={{className: valid ? 'form-control' : 'form-control is-invalid'}}
        value={date}
      />
    </div>
  );
}

export default DateTimePicker;