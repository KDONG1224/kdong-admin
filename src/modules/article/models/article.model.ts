import { BaseResponseProps } from 'modules/common';
import { UserRole } from 'modules/user';

export interface ArticleDetailStateProps {
  articleId: string;
}

export interface ArticleTagsProps {
  id: string;
  name: string;
  sequence: number;
}

export interface ArticleCategoryProps {
  id: string;
  categoryName: string;
  categoryNumber: number;
  subCategoryNumber: number;
}

export interface ArticleThumbnaiProps {
  id: string;
  bucket: string;
  key: string;
  filename: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  sequence: number;
  folder: string;
  contentType: string;
}

export interface ArticleListsProps {
  id: string;
  author: {
    role: UserRole;
    username: string;
    email: string;
  };
  category: ArticleCategoryProps;
  title: string;
  content: string;
  expose: boolean;
  mainExpose: boolean;
  commentCount: number;
  likeCount: number;
  readCount: number;
  createdAt: string;
  updatedAt: string;
  mainColor: string;
  subColor: string;
  tags: ArticleTagsProps[];
  thumbnails: ArticleThumbnaiProps[];
}

export interface ResponseArticleResultProps {
  articles: ArticleListsProps[];
  currentTotal: number;
  total: number;
}

export interface ResponseArticleLists extends BaseResponseProps {
  result: ResponseArticleResultProps;
}

export interface ResponseArticleDetail extends BaseResponseProps {
  result: ArticleListsProps;
}

export interface ResponseArticleDetailResultProps {
  currentPost: ArticleListsProps;
  prevPost?: ArticleListsProps;
  nextPost?: ArticleListsProps;
}

export interface ResponseArticleDetailProps extends BaseResponseProps {
  result: ResponseArticleDetailResultProps;
}
