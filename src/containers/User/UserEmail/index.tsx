// base
import { Key, useEffect, useMemo, useState } from 'react';

// styles
import { StyledUserEmail } from './style';

// containers
import { AdditionalProps, Searchbox } from 'containers';

// components
import { BasicButton, PaginationTable } from 'components';

// hokks
import { usePagination, useTargetScroll } from 'hooks';

// libraries
import dayjs from 'dayjs';
import { Switch } from 'antd';
import {
  QUERY_GET_ALL_WANTED,
  QUERY_SEND_MAILER,
  SendMailerProps,
  WantedApi,
  WantedListsProps
} from 'modules/wanted';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UserEmail = () => {
  const [isWantedLists, setIsWantedLists] = useState<WantedListsProps[]>([]);
  const [totalElement, setTotalElement] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const queryClient = useQueryClient();

  const { scrollY } = useTargetScroll({ y: 630, target: '.email-wrapper' });
  const { pagination, onChangePageSize } = usePagination({
    totalElement: totalElement
  });

  const wantedApi = useMemo(() => {
    return new WantedApi();
  }, []);

  const { data: result, isFetching } = useQuery(
    [QUERY_GET_ALL_WANTED],
    async () => {
      return await wantedApi.getAllWanted();
    },
    {
      select: (data) => {
        return data.result;
      }
    }
  );

  const { mutateAsync: sendEmail } = useMutation(
    [QUERY_SEND_MAILER],
    async (data: SendMailerProps) => {
      return await wantedApi.sendMailer(data);
    },
    {
      onSettled: () => {
        return queryClient.invalidateQueries([QUERY_GET_ALL_WANTED]);
      }
    }
  );

  const columns = useMemo(
    () => [
      { key: 'clientName', dataIndex: 'clientName', title: '요청자' },
      {
        key: 'clientEmail',
        dataIndex: 'clientEmail',
        title: '요청 이메일'
      },
      {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: '요청일',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD, A hh:mm')
      },
      {
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        title: '수정일',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD, A hh:mm')
      },
      {
        key: 'isSend',
        dataIndex: 'isSend',
        title: '발송여부',
        render: (text: boolean, record: any) => <Switch checked={text} />
      }
    ],
    []
  );

  const dataSource = useMemo(() => {
    if (!isWantedLists) return [];

    return isWantedLists;
  }, [isWantedLists]);

  const onSendEmail = () => {
    if (!selectedRowKeys.length) return alert('발송할 이메일을 선택해주세요.');

    const selectedEmails = isWantedLists.filter(
      (_, idx) => !selectedRowKeys.includes(idx)
    );

    const sendIds = selectedEmails.map((item) => item.id).join(',');

    sendEmail({ sendIds });
  };

  useEffect(() => {
    if (!result) return;

    setTotalElement(result.wantedLists.length);
    setIsWantedLists(result.wantedLists);
  }, [result]);

  console.log('=== selectedRowKeys == : ', selectedRowKeys);

  return (
    <StyledUserEmail>
      <div className="email-wrapper">
        <div className="email-wrapper-search">
          {/* <Searchbox onSearch={onSearch} /> */}
        </div>

        <div className="email-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={dataSource}
            pagination={{
              ...pagination,
              current:
                totalElement === dataSource.length ? 1 : pagination.current
            }}
            rowKey="index"
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
              }
            }}
            onChangePageSize={onChangePageSize}
            isLoading={isFetching}
            scroll={{ y: scrollY }}
            customLeft={<BasicButton btnText="발송" onClick={onSendEmail} />}
          />
        </div>
      </div>
    </StyledUserEmail>
  );
};
