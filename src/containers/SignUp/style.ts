import styled from 'styled-components';

export const StyledSignUp = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;

  .signup-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 58rem;
    height: 63.2rem;
    margin-bottom: 3rem;

    &-header {
      > h2 {
        text-align: center;
        font-feature-settings:
          'clig' off,
          'liga' off;
        font-size: 3rem;
        font-style: normal;
        font-weight: 900;
        line-height: 4.6rem;
        color: #4e5d78;
      }

      > p {
        text-align: center;
        font-feature-settings:
          'clig' off,
          'liga' off;
        font-size: 1.6rem;
        font-weight: 500;
        line-height: 2.4rem;
        color: #4e5d78;
      }
    }

    &-body {
      width: 100%;
      height: 52.2rem;
      border-radius: 20px;
      background: linear-gradient(
          0deg,
          rgba(78, 93, 120, 0) 0%,
          rgba(78, 93, 120, 0) 100%
        ),
        #fff;
      box-shadow: 3px -5px 35px 0px rgba(205, 205, 212, 0.1);
      padding: 4rem;

      &-form {
        .ant-form-item {
          margin-bottom: 2rem;
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
          margin: 1rem 0 1.6rem 1rem;
        }

        .ant-input-affix-wrapper {
          padding: 0 11px;
        }

        .ant-picker {
          width: 100%;
          padding: 1rem !important;
          font-size: 1.6rem;

          .ant-picker-input {
            flex-direction: row-reverse;

            > input {
              padding: 0 1rem !important;
              font-size: 1.6rem;
            }

            .ant-picker-suffix {
              > span {
                width: 1.6rem !important;
                height: 1.6rem !important;

                > svg {
                  width: 100% !important;
                  height: 100% !important;
                  color: #000 !important;
                }
              }
            }
          }
        }

        &-flex {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1.6rem;

          > div {
            width: 100%;
          }
        }

        &-forgot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #4e5d78;
          padding: 0 1.6rem;

          &-left {
            .ant-form-item {
              margin-bottom: 0rem !important;
            }
          }
        }

        &-btns {
          width: 100%;
          margin-top: 3rem;

          &-submit {
            > .ant-btn {
              width: 100% !important;
              height: auto;
              padding: 1.4rem 0;
              border-radius: 10px;
              background: #377dff;
              color: #fff;

              > span {
                font-size: 1.6rem;
                font-weight: 600;
              }
            }
          }

          &-signup {
            margin-top: 3rem;
            text-align: center;

            > p {
              font-size: 1.6rem;

              > span {
                margin-left: 3rem;
                color: #377dff;
                font-weight: 600;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
`;
