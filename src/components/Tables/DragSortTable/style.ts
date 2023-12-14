import { Table } from 'antd';
import styled from 'styled-components';

export const StyledDragSortTable = styled(Table)<{ isEmpty: boolean }>`
  .ant-table-placeholder {
    z-index: ${({ isEmpty }) => (isEmpty ? 9 : 1)} !important;
  }
`;
