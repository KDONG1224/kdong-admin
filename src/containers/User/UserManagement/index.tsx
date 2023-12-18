// base
import { useEffect, useMemo, useState } from 'react';

// styles
import { StyledUserManagement } from './style';

// comp[onents
import { PaginationTable } from 'components';

// modules
import { QUERY_GET_ALL_USERS } from 'modules';
import { userApi } from 'modules/user/apis/user.api';

// hooks
import { useTargetScroll, usePagination } from 'hooks';

// utils
import { addHyphen } from 'utils';

// libraries
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

export const UserManagement = () => {
  const [userLists, setUserLists] = useState<any[]>([]);
  const [totalElement, setTotalElement] = useState(0);

  const { scrollY } = useTargetScroll({
    y: 0
  });

  const { pagination, onChangePageSize } = usePagination({
    totalElement: totalElement
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

  const dataSource = useMemo(() => {
    if (!userLists) return [];

    return userLists;
  }, [userLists]);

  const { data: resultLists } = useQuery(
    [QUERY_GET_ALL_USERS],
    async () => await userApi.getAllUsers(),
    {
      select: (data) => data.result
    }
  );

  // const onSearch = (values: any) => {
  //   console.log(values);
  // };

  useEffect(() => {
    if (!resultLists) return;

    setUserLists(resultLists.users);
    setTotalElement(resultLists.totalElement);
  }, [resultLists]);

  return (
    <StyledUserManagement>
      <div className="management-wrapper">
        {/* <div className="management-wrapper-search">
          <Searchbox onSearch={onSearch} />
        </div> */}

        <div className="management-wrapper-table">
          <PaginationTable
            columns={columns}
            dataSource={dataSource}
            pagination={{
              ...pagination,
              current:
                totalElement === dataSource.length ? 1 : pagination.current
            }}
            onChangePageSize={onChangePageSize}
            scroll={{ y: scrollY }}
            showRowSelection={false}
          />
        </div>
      </div>
    </StyledUserManagement>
  );
};
