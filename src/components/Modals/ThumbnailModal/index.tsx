// base
import React, { Key, useEffect, useMemo, useState } from 'react';

// styles
import { StyledThumbnailModal } from './style';

// components
import { BasicButton, DragSortTable, LazyImage } from 'components';

// modules
import { PRcFile } from 'modules';
import { ArticleThumbnaiProps } from 'modules/article';

// libraries
import { ModalProps, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import type { DragEndEvent } from '@dnd-kit/core';

interface ThumbnailModalProps extends ModalProps {
  modalTitle?: string;
  isLoading?: boolean;
  isEdit: boolean;
  thumbnailLists: ArticleThumbnaiProps[] | PRcFile[];
  onOk: () => void;
  onCancel: () => void;
  onChangeUploadFile: (info: any) => void;
  onRemoveUploadFile: (index: Key) => void;
  setThumbnailLists: (values: ArticleThumbnaiProps[] | PRcFile[]) => void;
}

export const ThumbnailModal: React.FC<ThumbnailModalProps> = ({
  modalTitle = '파일 업로드',
  isLoading = false,
  isEdit,
  onOk,
  onCancel,
  thumbnailLists,
  setThumbnailLists,
  onRemoveUploadFile,
  onChangeUploadFile,
  ...props
}) => {
  const [activeImage, setActiveImage] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const columns = useMemo(() => {
    return [
      {
        key: 'sort'
      },
      {
        title: '순서',
        dataIndex: 'sequence'
      },
      {
        key: 'originalname',
        title: '파일명',
        dataIndex: 'originalname'
      },
      {
        key: 'mimetype',
        title: '파일 타입',
        dataIndex: 'mimetype'
      }
    ];
  }, []);

  const dataSource = useMemo(() => {
    return thumbnailLists;
  }, [thumbnailLists]);

  const onClickRow = (record: any) => {
    return {
      onClick: () => {
        setSelectedRowKeys([record.sequence]);
        setActiveImage(record);
      }
    };
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'error') {
      return false;
    }

    onChangeUploadFile(info);
  };

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    onRemoveUploadFile(selectedRowKeys[0]);
  };

  const beforeUpload = (file: RcFile) => {
    if (file.size > 10000000) {
      console.log('파일당 10MB를 초과할 수 없습니다.');

      return false;
    }

    return true;
  };

  const handleOk = () => {
    setActiveImage(null);
    setSelectedRowKeys([]);
    onOk();
  };

  useEffect(() => {
    if (thumbnailLists.length < 1) return;

    const lastItem = thumbnailLists[thumbnailLists.length - 1];

    setSelectedRowKeys([lastItem.sequence]);
    setActiveImage(lastItem);
  }, [isEdit, thumbnailLists]);

  return (
    <StyledThumbnailModal
      {...props}
      centered
      maskClosable
      onCancel={onCancel}
      width={800}
      footer={
        <div className="thumbnail-wrapper-footer">
          <BasicButton btnText="닫기" onClick={onCancel} />
          <BasicButton btnText="삭제" disabled onClick={handleRemoveFile} />
          <Upload
            listType="picture"
            showUploadList={false}
            maxCount={5}
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            customRequest={() => true}
          >
            <BasicButton btnText="업로드" />
          </Upload>

          <BasicButton btnText="저장" onClick={handleOk} />
        </div>
      }
    >
      <div className="thumbnail-wrapper">
        <div className="thumbnail-wrapper-title">
          <h2>{modalTitle}</h2>
        </div>

        <div className="thumbnail-wrapper-body">
          <div className="thumbnail-wrapper-body-left">
            <DragSortTable
              columns={columns}
              dataSource={dataSource as ArticleThumbnaiProps[]}
              pagination={false}
              onRow={onClickRow}
              setSequence={setThumbnailLists}
              onDragEnd={(e: DragEndEvent) => console.log(e)}
              rowSelection={{
                selectedRowKeys
              }}
            />
          </div>
          <div className="thumbnail-wrapper-body-right">
            <LazyImage
              src={activeImage && activeImage.location}
              alt="upload_image"
            />
          </div>
        </div>
      </div>
    </StyledThumbnailModal>
  );
};
