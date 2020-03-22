import * as React from 'react';
import * as DateTime from 'react-datetime';
import { Moment } from 'moment';


type DateTimePickerProps = {
  date: Date;
  updateDate: Function;
};

const DateTimePicker: React.FunctionComponent<DateTimePickerProps> = ({ date, updateDate }) => {

  return (
    <div className="datetime-picker">
      <DateTime value={date} onChange={(m: Moment) => updateDate(m.toDate())}  />
    </div>
  );
}

export default DateTimePicker;