import { STORAGE_KEY } from '@/constants/storage';
import type { Record as MemberRecord } from '@/types/record';
import { defaultRecords } from '@/types/record';

// 로컬 스토리지에서 데이터 불러오기
export const loadFromLocalStorage = (): MemberRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.state.members || defaultRecords;
    }
  } catch (error) {
    console.error('로컬 스토리지에서 데이터 불러오기 실패:', error);
  }
  return defaultRecords;
};

// 로컬 스토리지에 데이터 저장
export const saveToLocalStorage = (members: MemberRecord[]): void => {
  try {
    const data = {
      state: { members },
      version: 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('로컬 스토리지에 데이터 저장 실패:', error);
  }
};
