import { useMemberModalContext } from '@/contexts/MemberModalContext';
import type { Record as MemberRecord } from '@/utils/record';

export const useMemberModal = () => {
  const { modalOpen, modalMode, editingMember, setModalMode, setEditingMember, setModalOpen } =
    useMemberModalContext();

  const openCreateModal = () => {
    setModalMode('create');
    setEditingMember(undefined);
    setModalOpen(true);
  };

  const openEditModal = (member: MemberRecord) => {
    setModalMode('edit');
    setEditingMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = (values: Omit<MemberRecord, 'id'>) => {
    if (modalMode === 'create') {
      // TODO: 추가 기능 구현
      console.log('Create:', values);
    } else {
      // TODO: 수정 기능 구현
      console.log('Edit:', { ...values, id: editingMember?.id });
    }
    closeModal();
  };

  return {
    modalMode,
    modalOpen,
    editingMember,
    openCreateModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
  };
};
