import { useAuthContext } from '../Auth';
import { CategoryService, DatasetService, RecordService } from './services';

export const useService = () => {
  const { token } = useAuthContext();

  const dataset = DatasetService(token);
  const category = CategoryService();
  const record = RecordService();

  return { category, dataset, record };
};
