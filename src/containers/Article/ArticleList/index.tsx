// base
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

// styles
import { StyledArticleList } from './style';

// containers
import { AdditionalProps, Searchbox, SearchboxStateProps } from 'containers';

// components
import { BasicButton, LazyImage, PaginationTable } from 'components';

// hooks
import { usePagination, useTargetScroll } from 'hooks';

// modules
import {
  ArticleApi,
  ArticleListsProps,
  ArticleThumbnaiProps,
  QUERY_EXPOSE_ARTICLE,
  QUERY_GET_ALL_ARTICLES,
  ResponseArticleLists
} from 'modules/article';

// routs
import {
  ROUTE_ARTICLE_CREATE,
  ROUTE_ARTICLE_DETAIL_WITH_ID
} from 'routes/const';

// libraries
import dayjs from 'dayjs';
import { Switch } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ArticleList = () => {
  const [isArticles, setIsArticles] = useState<ArticleListsProps[]>([]);
  const [totalElement, setTotalElement] = useState(0);
  const [isSearch, setIsSearch] = useState<any>(undefined);

  const history = useHistory();
  const queryClient = useQueryClient();

  const { scrollY } = useTargetScroll({ y: 630, target: '.list-wrapper' });

  const { pagination, onChangePageSize } = usePagination({
    totalElement
  });

  const articleApi = useMemo(() => {
    return new ArticleApi();
  }, []);

  const { data: articles, isFetching } = useQuery<
    ResponseArticleLists,
    AxiosError,
    AdditionalProps
  >(
    [QUERY_GET_ALL_ARTICLES, history, isSearch],
    async ({ queryKey }) => {
      const [_, __, isSearch] = queryKey;

      if (isSearch) {
        const { where__dateRange, ...rest } =
          isSearch as SearchboxStateProps<any>;

        const query = {
          ...rest,
          where__fromDate: dayjs(where__dateRange[0]).format('YYYY-MM-DD'),
          where__toDate: dayjs(where__dateRange[1]).format('YYYY-MM-DD')
        };

        return await articleApi.getAllArticles(query);
      }

      return await articleApi.getAllArticles();
    },
    {
      select: (data) => {
        return data.result;
      }
    }
  );

  const { mutateAsync: changeExpose } = useMutation(
    [QUERY_EXPOSE_ARTICLE, articles],
    async (data: { id: string; type: 'main' | 'common'; expose: boolean }) => {
      const { id, type, expose } = data;

      if (type === 'main') {
        const body = {
          mainExpose: expose
        };

        return await articleApi.updateArticleMainExposeById(id, body);
      }

      return await articleApi.updateArticleExposeById(id, { expose });
    },
    {
      onSettled: () => {
        return queryClient.invalidateQueries([QUERY_GET_ALL_ARTICLES]);
      }
    }
  );

  const onChangeArticleExpose = useCallback(
    (record: ArticleListsProps, type: 'main' | 'common') => {
      changeExpose({ id: record.id, type, expose: !record.expose });
    },
    [changeExpose]
  );

  const onChangeArticleEdit = useCallback(
    (record: ArticleListsProps) => {
      history.push(ROUTE_ARTICLE_DETAIL_WITH_ID(record.id), {
        articleId: record.id
      });
    },
    [history]
  );

  const dataSource = useMemo(() => {
    if (!isArticles) return [];

    return isArticles;
  }, [isArticles]);

  const columns = useMemo(
    () => [
      { key: 'title', dataIndex: 'title', title: '제목' },
      {
        key: 'category',
        dataIndex: 'category',
        title: '카테고리',
        render: (text: any) => (text ? text.categoryName : '')
      },
      { key: 'readCount', dataIndex: 'readCount', title: '조회수' },
      { key: 'likeCount', dataIndex: 'likeCount', title: '좋아요' },
      {
        key: 'thumbnails',
        dataIndex: 'thumbnails',
        title: '썸네일',
        render: (texts: ArticleThumbnaiProps[]) =>
          texts && texts.length > 0 ? (
            <LazyImage src={texts[0].location} width="100%" height={100} />
          ) : (
            '없음'
          )
      },
      {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: '생성일',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
      },
      {
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        title: '수정일',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
      },
      {
        key: 'mainExpose',
        dataIndex: 'mainExpose',
        title: '메인 노출여부',
        render: (text: boolean, record: ArticleListsProps) => (
          <Switch
            checked={text}
            onChange={() => onChangeArticleExpose(record, 'main')}
          />
        )
      },
      {
        key: 'expose',
        dataIndex: 'expose',
        title: '노출여부',
        render: (text: boolean, record: ArticleListsProps) => (
          <Switch
            checked={text}
            onChange={() => onChangeArticleExpose(record, 'common')}
          />
        )
      },
      {
        key: 'edit',
        dataIndex: 'edit',
        title: '수정',
        render: (text: any, record) => (
          <BasicButton
            btnText="수정"
            onClick={() => onChangeArticleEdit(record)}
          />
        )
      }
    ],
    [onChangeArticleEdit, onChangeArticleExpose]
  );

  const onChangeNewArticle = () => {
    history.push(ROUTE_ARTICLE_CREATE, {
      articleId: ''
    });
  };

  const onSearch = <T extends AdditionalProps>(values: T) => {
    setIsSearch(values as T);
  };

  useEffect(() => {
    if (!articles) return;

    setIsArticles(articles.articles);
    setTotalElement(articles.total);
  }, [articles]);

  return (
    <StyledArticleList>
      <div className="list-wrapper">
        <div className="list-wrapper-search">
          <Searchbox onSearch={onSearch} />
        </div>

        <div className="list-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={dataSource}
            pagination={{
              ...pagination,
              current:
                totalElement === dataSource.length ? 1 : pagination.current
            }}
            onChangePageSize={onChangePageSize}
            isLoading={isFetching}
            scroll={{ y: scrollY }}
            customLeft={
              <BasicButton btnText="신규등록" onClick={onChangeNewArticle} />
            }
          />
        </div>
      </div>
    </StyledArticleList>
  );
};
