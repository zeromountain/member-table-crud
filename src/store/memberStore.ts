import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE } from '@/config';
import { memberService } from '@/services/memberService';
import type { Record as MemberRecord } from '@/types/record';

// 멤버 스토어 상태 인터페이스
interface MemberState {
  members: MemberRecord[];
  isLoading: boolean;
  error: string | null;
}

// 멤버 스토어 액션 인터페이스
interface MemberActions {
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<MemberRecord, 'id'>) => Promise<void>;
  updateMember: (id: string, member: Partial<MemberRecord>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  deleteMultipleMembers: (ids: string[]) => Promise<void>;
}

// 스토어 타입 정의
type MemberStore = MemberState & MemberActions;

// 로컬 스토리지 키
const STORAGE_KEY = 'member-records';

// 스토어 생성 함수
const createMemberStore = () => {
  // 기본 스토어 구현
  const baseStore: StateCreator<MemberStore> = (set) => ({
    members: [],
    isLoading: false,
    error: null,

    fetchMembers: async () => {
      set((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const members = await memberService.getMembers();
        set((state) => ({ ...state, members, isLoading: false }));
      } catch (error) {
        console.error(error);
        set((state) => ({
          ...state,
          isLoading: false,
          error: '회원 목록을 불러오는데 실패했습니다.',
        }));
      }
    },

    addMember: async (memberData: Omit<MemberRecord, 'id'>) => {
      set((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const newMember = await memberService.addMember(memberData);
        set((state) => ({
          ...state,
          members: [...state.members, newMember],
          isLoading: false,
        }));
      } catch (error) {
        console.error(error);
        set((state) => ({
          ...state,
          isLoading: false,
          error: '회원 추가에 실패했습니다.',
        }));
      }
    },

    updateMember: async (id: string, memberData: Partial<MemberRecord>) => {
      set((state) => ({ ...state, isLoading: true, error: null }));
      try {
        const updatedMember = await memberService.updateMember(id, memberData);
        if (updatedMember) {
          set((state) => ({
            ...state,
            members: state.members.map((member) => (member.id === id ? updatedMember : member)),
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error(error);
        set((state) => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : '회원 정보 수정에 실패했습니다.',
        }));
      }
    },

    deleteMember: async (id: string) => {
      set((state) => ({ ...state, isLoading: true, error: null }));
      try {
        await memberService.deleteMember(id);
        set((state) => ({
          ...state,
          members: state.members.filter((member) => member.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        console.error(error);
        set((state) => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : '회원 삭제에 실패했습니다.',
        }));
      }
    },

    deleteMultipleMembers: async (ids: string[]) => {
      set((state) => ({ ...state, isLoading: true, error: null }));
      try {
        await memberService.deleteMultipleMembers(ids);
        set((state) => ({
          ...state,
          members: state.members.filter((member) => !ids.includes(member.id)),
          isLoading: false,
        }));
      } catch (error) {
        console.error(error);
        set((state) => ({
          ...state,
          isLoading: false,
          error: '회원 삭제에 실패했습니다.',
        }));
      }
    },
  });

  // 스토리지 타입에 따라 스토어 생성
  if (STORAGE === 'local-storage') {
    return create<MemberStore>()(
      persist(baseStore, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ members: state.members }),
      }),
    );
  } else {
    // in-memory 스토리지
    return create<MemberStore>()(baseStore);
  }
};

// 멤버 스토어 생성
export const useMemberStore = createMemberStore();
