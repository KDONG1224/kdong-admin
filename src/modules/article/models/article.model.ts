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
}

export interface ArticleThumbnaiProps {
  id: string;
  location: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface ArticleListsProps {
  id: string;
  author: {
    role: 'ADMIN' | 'CLIENT' | 'USER';
    username: string;
    email: string;
  };
  catergoty?: string | null;
  content: string;
  expose: boolean;
  commentCount: number;
  likeCount: number;
  readCount: number;
  createdAt: string;
  updatedAt: string;
  tags: ArticleTagsProps[];
  thumbnail: ArticleThumbnaiProps[];
}

export interface ResponseArticleLists extends BaseResponseProps {
  result: {
    articles: ArticleListsProps[];
    currentTotal: number;
    total: number;
  };
}
