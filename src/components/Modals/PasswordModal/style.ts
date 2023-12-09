import { Modal } from 'antd';
import styled from 'styled-components';

export const StyledPasswordModal = styled(Modal)`
  .find-wrapper {
    &-title {
      margin-bottom: 2rem;

      > h2 {
        font-size: 2.4rem;
      }
    }

    &-body {
      &-form {
        &-btns {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-direction: row-reverse;

          > .ant-btn {
            &.cancel {
              background-color: #f2f2f6;
              color: #000;
              border: 1px solid #f2f2f6;
            }
          }
        }

        .ant-form-item {
          margin-bottom: 0.8rem;
        }

        .ant-input {
          padding: 1rem !important;
          font-size: 1.6rem;

          &::placeholder {
            font-size: 1.6rem;
          }
        }

        .ant-input-password-icon,
        .input-icons {
          width: 1.6rem !important;
          height: 1.6rem !important;

          > svg {
            width: 100% !important;
            height: 100% !important;
          }
        }

        .ant-form-item-explain-error {
          margin: 0.8rem 0 1.6rem 0;
        }
      }
    }
  }
`;
