import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import type { Record as MemberRecord } from '@/utils/record';

interface MemberModalContextType {
  modalOpen: boolean;
  modalMode: 'create' | 'edit';
  editingMember: MemberRecord | undefined;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalMode: Dispatch<SetStateAction<'create' | 'edit'>>;
  setEditingMember: Dispatch<SetStateAction<MemberRecord | undefined>>;
}

const MemberModalContext = createContext<MemberModalContextType | undefined>(undefined);

export const useMemberModalContext = (): MemberModalContextType => {
  const context = useContext(MemberModalContext);
  if (!context) {
    throw new Error('useMemberModal must be used within a MemberModalProvider');
  }
  return context;
};

interface MemberModalProviderProps {
  children: ReactNode;
}

export const MemberModalProvider = ({ children }: MemberModalProviderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingMember, setEditingMember] = useState<MemberRecord | undefined>();

  const value = {
    modalOpen,
    modalMode,
    editingMember,
    setModalOpen,
    setModalMode,
    setEditingMember,
  };

  return <MemberModalContext.Provider value={value}>{children}</MemberModalContext.Provider>;
};
