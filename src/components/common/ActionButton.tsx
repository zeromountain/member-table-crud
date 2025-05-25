import { Button, type ButtonProps } from 'antd';

import styled from '@emotion/styled';

interface ActionButtonProps extends ButtonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export const ActionButton = styled(Button)<ActionButtonProps>`
  min-width: ${({ width }) => width || '73px'};
  height: ${({ height }) => height || '32px'};
  padding: 0 12px;
  border-radius: ${({ radius }) => radius || '12px'};

  &:focus {
    outline: none;
  }

  &.ant-btn-dangerous {
    color: #ff4d4f;

    &:hover {
      color: #ff7875;
    }
  }
`;
