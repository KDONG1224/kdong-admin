// base
import React from 'react';

// styles
import { StyledBasicAvatar } from './style';

// libraries
import { AvatarProps } from 'antd';

interface BasicAvatarProps extends AvatarProps{
 text: string
}

export const BasicAvatar: React.FC<BasicAvatarProps> = ({ text, ...props }) => {
  return (
    <StyledBasicAvatar {...props}>
      {text}
    </StyledBasicAvatar>
  );
};
