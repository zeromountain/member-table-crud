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

  return {
    modalMode,
    modalOpen,
    editingMember,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};
