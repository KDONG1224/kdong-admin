// base
import { useCallback, useEffect, useMemo, useState } from 'react';

// styles
import { StyledArticleList } from './style';

// containers
import { Searchbox } from 'containers';

// components
import { BasicButton, LazyImage, PaginationTable } from 'components';

// hooks
import { usePagination, useTargetScroll } from 'hooks';

// libraries
import dayjs from 'dayjs';
import { Switch } from 'antd';
import {
  ROUTE_ARTICLE_CREATE,
  ROUTE_ARTICLE_DETAIL_WITH_ID
} from 'routes/const';
import { useHistory } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArticleApi, QUERY_GET_ALL_ARTICLES } from 'modules/article';

export interface SearchboxStateProps {
  'search-date-range': [dayjs.Dayjs, dayjs.Dayjs];
  'search-category': string;
  'search-type': string;
  'search-keyword': string;
}

export const ArticleList = () => {
  const [isArticles, setIsArticles] = useState<any[]>([]);
  const [totalElement, setTotalElement] = useState(0);

  const history = useHistory();

  const { scrollY } = useTargetScroll({ y: 630, target: '.list-wrapper' });

  const { pagination, onChangePageSize } = usePagination({
    totalElement
  });

  const articleApi = useMemo(() => {
    return new ArticleApi();
  }, []);

  const columns = useMemo(
    () => [
      { key: 'title', dataIndex: 'title', title: '제목' },
      { key: 'category', dataIndex: 'category', title: '카테고리' },
      { key: 'readCount', dataIndex: 'readCount', title: '조회수' },
      { key: 'likeCount', dataIndex: 'likeCount', title: '좋아요' },
      {
        key: 'thumbnails',
        dataIndex: 'thumbnails',
        title: '썸네일',
        render: (texts: any) => {
          console.log('== texts == : ', texts);

          return texts && texts.length > 0 ? (
            <LazyImage src={texts[0].location} width="100%" height={60} />
          ) : (
            '없음'
          );
        }
      },
      {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: '생성일',
        render: (text: any) => dayjs(text).format('YYYY-MM-DD')
      },
      {
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        title: '수정일',
        render: (text: any) => dayjs(text).format('YYYY-MM-DD')
      },
      {
        key: 'expose',
        dataIndex: 'expose',
        title: '노출여부',
        render: (text: any, record: any) => (
          <Switch
            checked={text}
            onChange={() => onChangeArticleExpose(record)}
          />
        )
      },
      {
        key: 'edit',
        dataIndex: 'edit',
        title: '수정',
        render: (text: any, record: any) => (
          <BasicButton
            btnText="수정"
            onClick={() => onChangeArticleEdit(record)}
          />
        )
      }
    ],
    []
  );

  const { data: articles, isLoading } = useQuery<any, any, any, any>(
    [QUERY_GET_ALL_ARTICLES, history],
    async () => {
      return await articleApi.getAllArticles();
    },
    {
      select: (data) => {
        return data.result;
      },
      onSuccess: (data) => {
        const { articles, total } = data;

        setIsArticles(articles);
        setTotalElement(total);
      }
    }
  );

  const onChangeArticleExpose = (record: any) => {
    console.log(record);
  };

  const onChangeArticleEdit = (record: any) => {
    history.push(ROUTE_ARTICLE_DETAIL_WITH_ID(record.id), {
      articleId: record.id
    });
  };

  const onChangeNewArticle = () => {
    history.push(ROUTE_ARTICLE_CREATE, {
      articleId: ''
    });
  };

  const onSearch = (values: any) => {
    console.log(values);
  };

  return (
    <StyledArticleList>
      <div className="list-wrapper">
        <div className="list-wrapper-search">
          <Searchbox onSearch={onSearch} />
        </div>

        <div className="list-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={isArticles}
            pagination={pagination}
            onChangePageSize={onChangePageSize}
            isLoading={isLoading}
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
