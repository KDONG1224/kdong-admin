import { Modal } from 'antd';
import styled from 'styled-components';

export const StyledThumbnailModal = styled(Modal)`
  .thumbnail-wrapper {
    &-body {
      display: flex;
      align-items: center;
      width: 100%;
      height: 400px;
      gap: 1rem;

      > div {
        flex: 0 0 50%;
        height: 100%;
        padding: 1rem 0;
        animation: fadeIn 0.5s ease-in-out;
      }

      &-left {
        .ant-table-thead {
          > tr {
            > td {
              border-start-end-radius: 0;
            }
          }
        }

        .ant-table-cell {
          text-align: center;
        }

        .ant-table-placeholder {
          height: 325px !important;
        }

        .ant-table-row-selected {
          .ant-table-cell {
            background-color: rgba(240, 220, 168, 0.3) !important;
          }
        }

        .ant-table-selection-column {
          display: none !important;
        }
      }

      &-right {
        > img {
          background: #eff1f4;
          object-fit: contain;
        }
      }
    }

    &-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.8rem;

      .ant-btn {
        /* width: 100%; */
      }

      .ant-upload-wrapper {
        .ant-upload-list {
          display: none !important;
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
