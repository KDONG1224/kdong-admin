import styled from 'styled-components';

export const StyledArticleCategory = styled.div`
  .category-wrapper {
    display: flex;
    gap: 1rem;

    > div {
      .ant-table-cell {
        text-align: center;
      }
    }

    &-left {
      flex: 0 0 30%;
    }

    &-right {
      flex: 0 0 70%;

      .ant-btn {
        height: 100% !important;
        padding: 0.3rem 1rem !important;
      }
    }
  }
`;
