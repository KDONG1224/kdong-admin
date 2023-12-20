// base
import { useCallback, useEffect, useMemo, useState } from 'react';

// styles
import { StyledGuestbookList } from './style';

// components
import { LazyImage, PaginationTable } from 'components';
import { usePagination, useTargetScroll } from 'hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  GuestbookApi,
  GuestbookImageProps,
  GuestbookListProps,
  QUERY_GUESTBOOK_LISTS,
  QUERY_GUESTBOOK_UPDATE,
  UpdateExposeGuestbookProps
} from 'modules/guestbook';
import { Switch } from 'antd';
import dayjs from 'dayjs';

export const GuestbookList = () => {
  const [guestbookLists, setGuestbookLists] = useState<any[]>([]);
  const [totalElement, setTotalElement] = useState(0);

  const queryClient = useQueryClient();

  const { scrollY } = useTargetScroll({
    y: 400
  });

  const { pagination, onChangePageSize } = usePagination({
    totalElement: totalElement
  });

  const guestbookApi = useMemo(() => {
    return new GuestbookApi();
  }, []);

  const { data: resultLists, isFetching } = useQuery(
    [QUERY_GUESTBOOK_LISTS, pagination.current],
    async () => {
      const query = {
        take: 20,
        page: pagination.current + 1
      };

      return await guestbookApi.getGuestbookList(query);
    },
    {
      select: (data) => {
        return data.result;
      }
    }
  );

  const { mutateAsync: changeExpose } = useMutation(
    [QUERY_GUESTBOOK_UPDATE],
    async (data: UpdateExposeGuestbookProps) => {
      return await guestbookApi.updateGuestbookExpose(data);
    },
    {
      onSettled: () => {
        setGuestbookLists([]);
        setTotalElement(0);
        return queryClient.invalidateQueries([QUERY_GUESTBOOK_LISTS]);
      }
    }
  );

  const onChangeExpose = useCallback(
    (record: GuestbookListProps) => {
      changeExpose({ id: record.id, expose: !record.expose });
    },
    [changeExpose]
  );

  const columns = useMemo(
    () => [
      { key: 'guestName', dataIndex: 'guestName', title: '게스트 이름' },
      {
        key: 'guestbookFiles',
        dataIndex: 'guestbookFiles',
        title: '썸네일',
        render: (texts: GuestbookImageProps[]) =>
          texts && texts.length > 0 ? (
            <LazyImage
              src={texts[0].location}
              width="100%"
              height={100}
              style={{ objectFit: 'contain', background: '#f5f5f5' }}
            />
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
        key: 'expose',
        dataIndex: 'expose',
        title: '노출여부',
        render: (text: boolean, record: GuestbookListProps) => (
          <Switch checked={text} onChange={() => onChangeExpose(record)} />
        )
      }
    ],
    [onChangeExpose]
  );

  const dataSource = useMemo(() => {
    if (!guestbookLists) return [];

    return guestbookLists;
  }, [guestbookLists]);

  const onInitValue = useCallback(() => {
    if (!resultLists) return;

    setGuestbookLists((prev) => [...prev, ...resultLists.guestbooks]);
    setTotalElement(resultLists.totalElements);
  }, [resultLists]);

  useEffect(() => {
    onInitValue();
  }, [onInitValue]);

  return (
    <StyledGuestbookList>
      <div className="guestbook-wrapper">
        <div className="guestbook-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={dataSource}
            pagination={{
              ...pagination,
              current:
                totalElement === dataSource.length ? 1 : pagination.current + 1
            }}
            onChangePageSize={onChangePageSize}
            scroll={{ y: scrollY }}
            showRowSelection={false}
            isLoading={isFetching}
          />
        </div>
      </div>
    </StyledGuestbookList>
  );
};
