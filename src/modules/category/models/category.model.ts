import { BaseResponseProps } from 'modules/common';

export interface CreateCategoryProps {
  categoryName: string;
  categoryNumber: number;
  subCategoryNumber: number;
}

export interface UpdateCategoryProps {
  categoryName: string;
  categoryNumber: number;
  subCategoryNumber: number;
  deleteStatus?: 'Y' | 'N';
}

export interface CategoryListsProps {
  id: string;
  categoryName: string;
  categoryNumber: number;
  subCategoryNumber: number;
  deleteStatus: 'Y' | 'N';
  createdAt: string;
  createdByUserId: string;
  updateAt: string;
}

export interface ResponseMainCategoryLists extends BaseResponseProps {
  result: {
    mainCategories: CategoryListsProps[];
  };
}

export interface ResponseSubCategoryLists extends BaseResponseProps {
  result: {
    subCategories: CategoryListsProps[];
  };
}
