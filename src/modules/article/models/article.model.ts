interface BaseResponseProps {
  code: number;
  isSuccess: boolean;
  message: string | string[];
}

export interface ArticleDetailStateProps {
  articleId: string;
}

export interface ArticleTagsProps {
  id: string;
  name: string;
  sequence: number;
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
    role: 'ADMIN' | 'CLIENT' | 'USER';
    username: string;
    email: string;
  };
  category?: {
    id: string;
    catergotyName: string;
    catergotyNumber: number;
    subCatergotyNumber: number;
  };
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
