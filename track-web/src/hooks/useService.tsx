import { useAuthContext } from '../Auth';
import { DatasetService } from './services';
import { CategoryService } from './services/categoryService';

export const useService = () => {
  const { token } = useAuthContext();

  const dataset = DatasetService(token);
  const category = CategoryService();

  return { category, dataset };
};
