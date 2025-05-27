import type { PropsWithChildren } from 'react';

import { Typography } from 'antd';

import styled from '@emotion/styled';

const Text = styled(Typography.Text)`
  display: block;
  font-size: 12px;
  margin-top: 4px;
`;

export const ErrorText = ({ children }: PropsWithChildren) => {
  return <Text type="danger">{children}</Text>;
};
