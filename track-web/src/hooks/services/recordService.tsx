import { Record } from '../../models/odata';
import ApiRequest from '../../utils/Request';

export const RecordService = () => {
  const createRecord = (record: Record): Promise<any> => {
    return new ApiRequest('Records').Post(record);
  };

  return { createRecord };
};
