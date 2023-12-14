import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const StyledProfileBanner = styled.div`
  .banner-wrapper {
    width: 100%;

    &-btns {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1.4rem;
    }

    .sub-title {
      font-size: 12px;
      color: #999;
    }

    .ant-form-item {
      margin-bottom: 0;
    }

    .ant-input {
      width: 85%;
      margin-bottom: 20px;
    }

    .minus-icon {
      height: 34px;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }

    .anticon-minus-circle {
      font-size: 18px;
    }

    .banner-title-speed-box {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;

      .ant-slider {
        width: 85%;
      }
    }

    .ant-descriptions-item-content {
      &.image {
        > span {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
      }
    }

    .image-lists {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      &-box {
        width: 150px;
        height: 150px;
        position: relative;

        > img {
          width: 100%;
        }
      }
    }
  }
`;

export const StyledAddImageWrap = styled.div`
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  background: #fafafa;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 5px 5px 0; */
  cursor: pointer;
  vertical-align: top;
  background-color: #f5f5f5;
`;

export const StyledPlusOutlined = styled(PlusOutlined)`
  font-size: 20px;
  color: #bdbdbd;
  line-height: 150px;
  padding: 0 65px 0 65px;
`;

export const StyledCloseOutlined = styled(CloseOutlined)`
  position: absolute;
  background-color: #f5222d;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  top: 0;
  right: 0;
  padding: 3px;
  z-index: 1000;
`;
