import { v4 as uuidv4 } from 'uuid';

import { STORAGE } from '@/config';
import type { Record as MemberRecord } from '@/types/record';
import { defaultRecords } from '@/types/record';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';

// 회원 서비스 클래스
export class MemberService {
  protected members: MemberRecord[] = [];

  constructor() {
    this.members = STORAGE === 'local-storage' ? loadFromLocalStorage() : [...defaultRecords];
  }

  // 회원 목록 조회
  async getMembers(): Promise<MemberRecord[]> {
    return this.members;
  }

  // 회원 추가
  async addMember(memberData: Omit<MemberRecord, 'id'>): Promise<MemberRecord> {
    const newMember: MemberRecord = {
      ...memberData,
      id: uuidv4(),
    };

    this.members = [...this.members, newMember];

    if (STORAGE === 'local-storage') {
      saveToLocalStorage(this.members);
    }

    return newMember;
  }

  // 회원 수정
  async updateMember(id: string, memberData: Partial<MemberRecord>): Promise<MemberRecord | null> {
    const memberIndex = this.members.findIndex((member) => member.id === id);

    if (memberIndex === -1) {
      throw new Error('회원을 찾을 수 없습니다.');
    }

    const updatedMember = {
      ...this.members[memberIndex],
      ...memberData,
    };

    const updatedMembers = [...this.members];
    updatedMembers[memberIndex] = updatedMember;
    this.members = updatedMembers;

    if (STORAGE === 'local-storage') {
      saveToLocalStorage(this.members);
    }

    return updatedMember;
  }

  // 회원 삭제
  async deleteMember(id: string): Promise<boolean> {
    const originalLength = this.members.length;
    this.members = this.members.filter((member) => member.id !== id);

    if (this.members.length === originalLength) {
      throw new Error('삭제할 회원을 찾을 수 없습니다.');
    }

    if (STORAGE === 'local-storage') {
      saveToLocalStorage(this.members);
    }

    return true;
  }

  // 여러 회원 삭제
  async deleteMultipleMembers(ids: string[]): Promise<boolean> {
    this.members = this.members.filter((member) => !ids.includes(member.id));

    if (STORAGE === 'local-storage') {
      saveToLocalStorage(this.members);
    }

    return true;
  }
}

// 싱글톤 인스턴스 생성
export const memberService = new MemberService();
