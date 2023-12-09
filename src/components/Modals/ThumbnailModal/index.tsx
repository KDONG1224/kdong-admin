// base
import React, { useMemo, useState } from 'react';

// styles
import { StyledThumbnailModal } from './style';

// components
import { BasicButton, DragSortTable, LazyImage } from 'components';

// libraries
import { ModalProps, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { DragEndEvent } from '@dnd-kit/core';

interface ThumbnailModalProps extends ModalProps {
  modalTitle?: string;
  isLoading?: boolean;
  isEdit: boolean;
  data: UploadFile[];
  thumnaillist: UploadFile[];
  onOk: () => void;
  onCancel: () => void;
  onChangeUploadFile: (file: UploadFile[], originFile: any[]) => void;
  setThumnaillist: (file: UploadFile[]) => void;
}

export const ThumbnailModal: React.FC<ThumbnailModalProps> = ({
  modalTitle = '파일 업로드',
  isLoading = false,
  isEdit,
  data,
  onOk,
  onCancel,
  thumnaillist,
  setThumnaillist,
  onChangeUploadFile,
  ...props
}) => {
  const [activeImage, setActiveImage] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

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
        dataIndex: 'mimetype',
        render: (text: string) => text.split('/')[1]
      }
    ];
  }, []);

  const dataSource = useMemo(() => {
    return thumnaillist;
  }, [thumnaillist]);

  const onClickRow = (record: any) => {
    return {
      onClick: () => {
        setSelectedRowKeys([record.sequence]);
        setActiveImage(record);
      }
    };
  };

  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'error') {
      return false;
    }

    const newFileList = info.fileList.map((file, idx) => {
      if (file.originFileObj) {
        const blob = new Blob([file.originFileObj], {
          type: file.type
        });
        const blobUrl = URL.createObjectURL(blob);

        return {
          ...file.originFileObj,
          sequence: idx + 1,
          originalname: file.name,
          mimetype: file.type,
          location: blobUrl
        };
      }

      return file;
    }) as any[];

    console.log('== info == : ', info);
    console.log('== newFileList == : ', newFileList);

    const lastItme = newFileList[newFileList.length - 1];

    console.log('== lastItme == : ', lastItme);

    setActiveImage(lastItme);
    setSelectedRowKeys([lastItme.sequence]);

    onChangeUploadFile(info.fileList, newFileList);
  };

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    console.log('삭제');

    // onChangeUploadFile([]);
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
          <BasicButton btnText="삭제" onClick={handleRemoveFile} />
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
              dataSource={dataSource}
              pagination={false}
              onRow={onClickRow}
              setSequence={setThumnaillist as any}
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
