// base
import { useMemo, useState } from 'react';

// styles
import { StyledGuestbookList } from './style';

// components
import { PaginationTable } from 'components';
import { usePagination, useTargetScroll } from 'hooks';

export const GuestbookList = () => {
  const [guestbookLists, setGuestbookLists] = useState<any[]>([]);
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
        title: '휴대전화'
      },
      {
        key: 'birthday',
        dataIndex: 'birthday',
        title: '생년월일'
      },
      { key: 'role', dataIndex: 'role', title: '권환' },
      {
        key: 'status',
        dataIndex: 'status',
        title: '활동유무'
      }
    ],
    []
  );

  const dataSource = useMemo(() => {
    if (!guestbookLists) return [];

    return guestbookLists;
  }, [guestbookLists]);

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
                totalElement === dataSource.length ? 1 : pagination.current
            }}
            onChangePageSize={onChangePageSize}
            scroll={{ y: scrollY }}
            showRowSelection={false}
          />
        </div>
      </div>
    </StyledGuestbookList>
  );
};
