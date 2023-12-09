// base
import React, { useEffect, useRef, useState } from 'react';

// styles
import { StyledBasicTag } from './style';

// libraries
import type { InputRef } from 'antd';
import { Input, Space, Tag, TagProps, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface BasicTagProps extends TagProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
}

export const BasicTag: React.FC<BasicTagProps> = ({
  tags,
  onChangeTags,
  ...props
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);

    onChangeTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      onChangeTags([...tags, inputValue]);
    }

    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;

    onChangeTags(newTags);

    setEditInputIndex(-1);
    setEditInputValue('');
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  return (
    <StyledBasicTag>
      <Space size={[0, 8]} wrap>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={editInputRef}
                key={tag}
                size="small"
                style={{
                  height: 22,
                  width: 64,
                  marginInlineEnd: 8,
                  verticalAlign: 'top'
                }}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={index !== 0}
              style={{ userSelect: 'none' }}
              onClose={() => handleClose(tag)}
              {...props}
            >
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{
              height: 22,
              width: 64,
              marginInlineEnd: 8,
              verticalAlign: 'top'
            }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            style={{ height: 22, background: '#fafafa', borderStyle: 'dashed' }}
            icon={<PlusOutlined />}
            onClick={showInput}
            {...props}
          >
            태그 추가
          </Tag>
        )}
      </Space>
    </StyledBasicTag>
  );
};
