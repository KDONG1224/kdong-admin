import { useMemo, useCallback, useRef, useState } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'consts';

export interface UsePaginationProps {
  totalElement: number;
  defaultPage?: number;
  defaultPageSize?: number;
  onChangePagination?: (page: number, size: number) => void;
}

export const usePagination = ({
  totalElement,
  onChangePagination,
  defaultPage = DEFAULT_PAGE,
  defaultPageSize = DEFAULT_PAGE_SIZE
}: UsePaginationProps) => {
  const [pager, setPager] = useState({
    page: defaultPage,
    pageSize: defaultPageSize
  });

  const changePaginationRef = useRef<Function>();

  changePaginationRef.current = onChangePagination;

  const setPagination = useCallback((page?: number, pageSize?: number) => {
    setPager((pager) => Object.assign({}, pager, { page, pageSize }));
  }, []);

  const pagination = useMemo(() => {
    return {
      total: totalElement,
      current: totalElement === 1 ? 1 : pager.page,
      pageSize: pager.pageSize,
      showSizeChanger: false,
      onChange: (page: number, pageSize: number = pager.pageSize) => {
        if (changePaginationRef.current) {
          changePaginationRef.current(page, pageSize);
        }

        setPagination(page, pageSize);
      }
    };
  }, [totalElement, pager, setPagination]);

  const onChangePageSize = useCallback(
    (page: number, pageSize: number = pager.pageSize) => {
      if (changePaginationRef.current) {
        changePaginationRef.current(page, pageSize);
      }

      setPagination(page, pageSize);
    },
    [pager.pageSize, setPagination]
  );

  return {
    page: pager.page,
    pageSize: pager.pageSize,
    pagination,
    onChangePageSize,
    setPagination
  };
};
