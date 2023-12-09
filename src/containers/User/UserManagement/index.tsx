import React, { useMemo, useState } from 'react';
import { StyledUserManagement } from './style';
import { Searchbox } from 'containers';
import { LazyImage, PaginationTable } from 'components';
import { useTargetScroll, usePagination } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { QUERY_GET_ALL_USERS } from 'modules';
import { userApi } from 'modules/user/apis/user.api';
import { AxiosError } from 'axios';
import { addHyphen } from 'utils';
import dayjs from 'dayjs';

export const UserManagement = () => {
  const { scrollY } = useTargetScroll({
    y: 0
  });

  const columns = useMemo(
    () => [
      { key: 'username', dataIndex: 'username', title: '이름' },
      {
        key: 'phoneNumber',
        dataIndex: 'phoneNumber',
        title: '휴대전화',
        render: (text: string) => addHyphen(text)
      },
      {
        key: 'birthday',
        dataIndex: 'birthday',
        title: '생년월일',
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
      },
      { key: 'role', dataIndex: 'role', title: '권환' },
      {
        key: 'status',
        dataIndex: 'status',
        title: '활동유무',
        render: (text: boolean) => (text ? '활동' : '정지')
      }
    ],
    []
  );

  const { data } = useQuery(
    [QUERY_GET_ALL_USERS],
     async () => await userApi.getAllUsers(),
     {
      select: (data) => data
    }
  );

  const { pagination, onChangePageSize } = usePagination({
    totalElement: data.totalElement 
  });

  const onSearch = (values: any) => {
    console.log(values);
  };

  console.log('== data == : ', data);
  console.log('== pagination == : ', pagination);

  // if (isFetching) return <div>Loading...</div>;

  return (
    <StyledUserManagement>
      <div className="management-wrapper">
        <div className="management-wrapper-search">
          <Searchbox onSearch={onSearch} />
        </div>

        <div className="management-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={data.result}
            pagination={data && data.result.length < 2 ? {
              ...pagination,
              current: 1
            }: pagination}
            onChangePageSize={onChangePageSize}
            scroll={{ y: scrollY }}
            onChangeExpose={(value: boolean) => console.log('== value == : ', value)}
          />
        </div>
      </div>
    </StyledUserManagement>
  );
};
