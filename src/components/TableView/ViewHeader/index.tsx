import type { Dispatch, SetStateAction } from 'react';

import { Flex, Modal } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import { ActionButton } from '@/components/common/ActionButton';
import { Title } from '@/components/common/Title';
import { useMemberModal } from '@/hooks/useMemberModal';
import { useMemberStore } from '@/store/memberStore';

import { HeaderContainer } from './styles';

const ViewHeader = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
}) => {
  const { openCreateModal } = useMemberModal();
  const { deleteMultipleMembers } = useMemberStore();

  const handleDeleteSelected = () => {
    if (!selectedRowKeys.length) return;

    Modal.confirm({
      title: '선택한 회원 삭제',
      content: `선택한 ${selectedRowKeys.length}명의 회원을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteMultipleMembers(selectedRowKeys as string[]);
          setSelectedRowKeys([]);
        } catch (error) {
          console.error('회원 일괄 삭제 중 오류가 발생했습니다:', error);
        }
      },
    });
  };
  return (
    <HeaderContainer justify="space-between" align="center">
      <Title level={5}>회원 목록</Title>
      <Flex gap="8px">
        {selectedRowKeys.length > 1 && (
          <ActionButton danger icon={<DeleteOutlined />} onClick={handleDeleteSelected}>
            선택한 {selectedRowKeys.length}개 삭제
          </ActionButton>
        )}
        <ActionButton type="primary" onClick={openCreateModal}>
          + 추가
        </ActionButton>
      </Flex>
    </HeaderContainer>
  );
};

export default ViewHeader;
