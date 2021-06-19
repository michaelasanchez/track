import { useEffect, useState } from 'react';
import { Category } from '../../models/odata';
import ApiRequest from '../../utils/Request';

export const CategoryService = () => {
  const [categoryListLoading, setCategoryListLoading] =
    useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>();

  const loadCategoryList = () => {
    setCategoryListLoading(true);
    new ApiRequest('Categories')
      .Get()
      .then((resp: any) => {
        setCategoryList(resp.value);
      })
      .finally(() => {
        setCategoryListLoading(false);
      });
  };

  const createCategory = (category: Category): Promise<Category> => {
    return new ApiRequest('Categories').Post(category).then((category) => {
      loadCategoryList();
      return category;
    });
  };

  useEffect(() => {
    loadCategoryList();
  }, []);

  return {
    categoryList,
    categoryListLoading,
    createCategory,
    loadCategoryList,
  };
};
