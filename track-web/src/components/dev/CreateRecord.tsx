import React from 'react';

export const CreateRecord: React.FunctionComponent<{}> = () => {
  return (
    <div className="create-record">
      <div className="date-time-header">
        <h4>Today</h4>
        <h4>{new Date().toDateString()}</h4>
      </div>
      <div>I...</div>
    </div>
  );
};
