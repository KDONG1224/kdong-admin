import styled from 'styled-components';

export const StyledSearchbox = styled.div`
  .search-wrapper {
    padding: 1.4rem;
    background: #f6f6f6;
    border-radius: 8px;

    .ant-descriptions-item-container {
      align-items: center;
    }

    .ant-descriptions-item-label {
      max-width: 80px;
      width: 100%;
      height: 30px;
      font-family: NotoSansKR-Medium;
      font-size: 14px;
      color: #343434;
      vertical-align: middle;
      display: inline-block;
      line-height: 30px;
    }

    .ant-descriptions-item {
      padding-bottom: 0.8rem;
    }

    .ant-form-item {
      margin-bottom: 0;
    }

    .ant-btn {
      height: 100% !important;
      padding: 0.4rem 1.5rem !important;
    }

    .flex-box {
      justify-content: space-between;
      gap: 0.8rem;
    }

    &-bottom {
      display: flex;
      flex-direction: row-reverse;
      gap: 0.8rem;
    }
  }
`;
