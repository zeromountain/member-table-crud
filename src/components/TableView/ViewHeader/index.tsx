import { ActionButton } from '@/components/common/ActionButton';
import { Title } from '@/components/common/Title';

import { HeaderContainer } from './styles';

const ViewHeader = () => {
  return (
    <HeaderContainer justify="space-between" align="center">
      <Title level={5}>회원 목록</Title>
      <ActionButton type="primary">+ 추가</ActionButton>
    </HeaderContainer>
  );
};

export default ViewHeader;
