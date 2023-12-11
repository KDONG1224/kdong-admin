// base
import React from 'react';

// styles
import { StyledCategoryEditModal } from './style';

// libraries
import { Input, ModalProps } from 'antd';

interface CategoryEditModalProps extends ModalProps {
  value: string;
  isEdit: boolean;
  onChangeInput: (value: string) => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  value,
  isEdit,
  onChangeInput,
  ...props
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInput(e.target.value);
  };

  return (
    <StyledCategoryEditModal {...props} centered maskClosable>
      <div className="edit-wrapper">
        <div className="edit-wrapper-title">
          <h2>카테고리 {isEdit ? '편집' : '추가'}</h2>
        </div>

        <div className="edit-wrapper-body">
          <div className="edit-wrapper-body-desc">
            <p>카테고리를 {isEdit ? '편집' : '추가'}할 수 있습니다.</p>
          </div>

          <div className="edit-wrapper-body-content">
            <Input
              value={value}
              placeholder="카테고리 이름을 입력해주세요."
              onChange={handleInput}
            />
          </div>
        </div>
      </div>
    </StyledCategoryEditModal>
  );
};
