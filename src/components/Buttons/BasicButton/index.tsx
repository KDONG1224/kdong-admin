import { ButtonProps } from 'antd';
import React from 'react';
import { StyledBasicButton } from './style';

interface BasicButtonProps extends ButtonProps {
  btnText: string;
}

export const BasicButton: React.FC<BasicButtonProps> = ({
  btnText,
  ...props
}) => {
  return (
    <StyledBasicButton type="primary" size="large" {...props}>
      {btnText}
    </StyledBasicButton>
  );
};
