import React, { Key, useEffect, useMemo, useRef, useState } from 'react';
import { StyledPaginationTable } from './style';
import { Button, Col, Row, Select, Space, Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { PaginationProps } from 'antd/lib';
import { DEFAULT_PAGE_SIZE, pageSizeRange } from 'consts';

interface PaginationTableProps<T> extends TableProps<T> {
  noAsync?: boolean;
  noIndex?: boolean;
  noSort?: boolean;
  isLoading?: boolean;
  columns: ColumnsType<T>;
  dataSource: T[];
  customLeft?: React.ReactNode;
  customRight?: React.ReactNode;
  showPageSize?: boolean;
  showRowSelection?: boolean;
  onChangePageSize?: (page: number, pageSize: number) => void;
  onChangeExpose?: (value: boolean) => void;
}

interface Pagination extends PaginationProps {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
}

export const PaginationTable = <T extends {}>({
  noAsync = false,
  noIndex = false,
  noSort = false,
  isLoading = false,
  columns,
  dataSource,
  customLeft,
  customRight,
  showPageSize = true,
  showRowSelection = true,
  onChangePageSize,
  onChangeExpose,
  ...tableOptions
}: PaginationTableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const hasSelected = useMemo(() => {
    return selectedRowKeys.length > 0;
  }, [selectedRowKeys]);

  const pagination = useMemo<Pagination>(() => {
    return {
      total: 0,
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      showSizeChanger: false,
      ...tableOptions.pagination
    };
  }, [tableOptions.pagination]);

  const rowSelection = useMemo(() => {
    if (showRowSelection) {
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys: Key[], selectedRows: T[]) => {
          setSelectedRowKeys(selectedRowKeys as string[]);
        },
        ...tableOptions.rowSelection
      };
    } else {
      return undefined;
    }
  }, [tableOptions.rowSelection, selectedRowKeys, showRowSelection]);

  const handleChangePageSize = (pageSize: number) => {
    if (onChangePageSize) {
      onChangePageSize(1, pageSize);
    }
  };

  const dataSourceRef = useRef(dataSource);

  useEffect(() => {
    if (dataSourceRef.current.length === dataSource.length) {
      return;
    }

    if (pagination.total && dataSource.length === 0) {
      if (pagination.onChange) {
        pagination.onChange(
          pagination.current > 1 ? pagination.current - 1 : 1,
          pagination.pageSize
        );
      }
    }
  }, [pagination, dataSource]);

  useEffect(() => {
    dataSourceRef.current = dataSource;
  }, [dataSource]);

  return (
    <StyledPaginationTable>
      {pagination.total !== null && (
        <div className="pagination-table-total">
          <span>검색결과 총 {pagination.total} 건</span>
        </div>
      )}
      <Row style={{ marginBottom: 10 }} justify="space-between">
        <Col>
          <Space size={5}>
            {onChangeExpose && (
              <>
                <Button
                  onClick={() => onChangeExpose(true)}
                  type="primary"
                  disabled={!hasSelected}
                >
                  선택 공개
                </Button>
                <Button
                  type="primary"
                  onClick={() => onChangeExpose(false)}
                  danger
                  disabled={!hasSelected}
                >
                  선택 비공개
                </Button>
              </>
            )}
            {customLeft}
          </Space>
        </Col>
        <Col>
          <Space size={5}>
            {customRight}
            {showPageSize && (
              <Select
                style={{ width: 150, marginLeft: 5 }}
                defaultValue={DEFAULT_PAGE_SIZE}
                value={pagination.pageSize ? pagination.pageSize : undefined}
                onChange={handleChangePageSize}
              >
                {pageSizeRange.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}개씩 보기
                  </Select.Option>
                ))}
              </Select>
            )}
          </Space>
        </Col>
      </Row>
      <Table
        {...tableOptions}
        pagination={pagination}
        rowSelection={rowSelection}
        loading={isLoading}
        columns={
          noIndex
            ? columns
            : [
                {
                  title: 'No',
                  dataIndex: 'index',
                  key: 'index'
                },
                ...columns
              ]
        }
        dataSource={
          !noAsync && dataSource.length
            ? dataSource.map((item, i) => ({
                ...item,
                index:
                  pagination.total -
                  i -
                  (pagination.current * pagination.pageSize -
                    pagination.pageSize)
              }))
            : noSort
              ? dataSource.map((item, i) => ({
                  ...item,
                  index: i + 1
                }))
              : dataSource.map((item, i) => ({
                  ...item,
                  index: pagination.total - i
                }))
        }
      />
    </StyledPaginationTable>
  );
};
