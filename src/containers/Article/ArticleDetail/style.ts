import styled from 'styled-components';

export const StyledArticleDetail = styled.div`
  .detail-wrapper {
    display: block;
    width: 100%;
    position: relative;

    &-default {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-category {
        width: 140px;
        display: flex;
        align-items: center;
        gap: 0.8rem;

        .ant-select {
          min-width: 20rem;
          width: 100%;
        }
      }

      &-btns {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 0.8rem;
      }
    }

    &-top {
      margin: 18px auto 17px;
      padding-bottom: 26px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      > textarea {
        resize: none;
        border-radius: 0;
        border: none;
        height: 42px !important;
        display: block;
        width: 100%;
        height: 56px;
        border: none;
        font-size: 30px;
        color: #202020;
        resize: none;
        outline: 0 none;
        line-height: 40px;
        overflow: hidden;
        letter-spacing: -0.4px;
      }

      .ant-input {
        &:focus {
          box-shadow: none !important;
        }

        &:focus-within {
          box-shadow: none !important;
        }
      }
    }

    &-body {
      width: 100%;
      display: block;
    }

    &-footer {
      margin-top: 2.6rem;
    }
  }
`;
