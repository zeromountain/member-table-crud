import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_STORAGE } from '@/constants/storage';
import { MemberService } from '@/services/memberService';
import { defaultRecords } from '@/types/record';
import type { Record as MemberRecord } from '@/types/record';

// 테스트용 MemberService 클래스
class TestableMemberService extends MemberService {
  public getMembersArray(): MemberRecord[] {
    return this.members;
  }

  public setMembersArray(members: MemberRecord[]): void {
    this.members = members;
  }
}

// localStorage 모킹
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// STORAGE 설정을 'local-storage'로 강제
vi.mock('@/config', () => ({
  STORAGE: DEFAULT_STORAGE,
}));

describe('MemberService', () => {
  let testService: TestableMemberService;

  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.clear();

    testService = new TestableMemberService();
    testService.setMembersArray([...defaultRecords]);
  });

  describe('getMembers', () => {
    it('기본 회원 목록을 반환해야 합니다', async () => {
      const members = await testService.getMembers();
      expect(members).toEqual(defaultRecords);
    });

    it('localStorage에서 데이터를 불러와야 합니다', async () => {
      const mockData = {
        state: {
          members: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: '홍길동',
              address: '서울 강남구',
              memo: '테스트 메모',
              joinDate: '2024-03-20',
              job: '개발자' as const,
              emailSubscription: true,
            },
          ],
        },
        version: 0,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      testService.setMembersArray([]);
      const service = new TestableMemberService();
      const members = await service.getMembers();
      expect(members).toEqual(mockData.state.members);
    });
  });

  describe('addMember', () => {
    it('새로운 회원을 추가해야 합니다', async () => {
      const newMemberData = {
        name: '홍길동',
        address: '서울 강남구',
        memo: '테스트 메모',
        joinDate: '2024-03-20',
        job: '개발자' as const,
        emailSubscription: true,
      };

      const addedMember = await testService.addMember(newMemberData);

      expect(addedMember).toMatchObject({
        ...newMemberData,
        id: expect.any(String),
      });

      const members = await testService.getMembers();
      expect(members).toContainEqual(addedMember);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('커스텀 필드가 있는 회원을 추가할 수 있어야 합니다', async () => {
      const newMemberData = {
        name: '홍길동',
        address: '서울 강남구',
        memo: '테스트 메모',
        joinDate: '2024-03-20',
        job: '개발자' as const,
        emailSubscription: true,
        customField1: '커스텀 값 1',
        customField2: '커스텀 값 2',
      };

      const addedMember = await testService.addMember(newMemberData);
      expect(addedMember).toMatchObject({
        ...newMemberData,
        id: expect.any(String),
      });

      const members = await testService.getMembers();
      expect(members).toContainEqual(addedMember);
    });
  });

  describe('updateMember', () => {
    it('기존 회원 정보를 수정해야 합니다', async () => {
      const newMemberData = {
        name: '홍길동',
        address: '서울 강남구',
        memo: '테스트 메모',
        joinDate: '2024-03-20',
        job: '개발자' as const,
        emailSubscription: true,
      };

      const addedMember = await testService.addMember(newMemberData);
      const updateData = {
        name: '김철수',
        address: '서울 서초구',
      };

      const updatedMember = await testService.updateMember(addedMember.id, updateData);

      expect(updatedMember).toMatchObject({
        ...addedMember,
        ...updateData,
      });

      const members = await testService.getMembers();
      expect(members).toContainEqual(updatedMember);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('존재하지 않는 회원을 수정하려고 하면 에러를 발생시켜야 합니다', async () => {
      await expect(testService.updateMember('non-existent-id', { name: '홍길동' })).rejects.toThrow(
        '회원을 찾을 수 없습니다.',
      );
    });
  });

  describe('deleteMember', () => {
    it('회원을 삭제해야 합니다', async () => {
      const newMemberData = {
        name: '홍길동',
        address: '서울 강남구',
        memo: '테스트 메모',
        joinDate: '2024-03-20',
        job: '개발자' as const,
        emailSubscription: true,
      };

      const addedMember = await testService.addMember(newMemberData);
      const result = await testService.deleteMember(addedMember.id);

      expect(result).toBe(true);
      const members = await testService.getMembers();
      expect(members.find((m) => m.id === addedMember.id)).toBeUndefined();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('존재하지 않는 회원을 삭제하려고 하면 에러를 발생시켜야 합니다', async () => {
      await expect(testService.deleteMember('non-existent-id')).rejects.toThrow(
        '삭제할 회원을 찾을 수 없습니다.',
      );
    });
  });

  describe('deleteMultipleMembers', () => {
    it('여러 회원을 삭제해야 합니다', async () => {
      const member1 = await testService.addMember({
        name: '홍길동',
        address: '서울 강남구',
        memo: '테스트 메모 1',
        joinDate: '2024-03-20',
        job: '개발자' as const,
        emailSubscription: true,
      });

      const member2 = await testService.addMember({
        name: '김철수',
        address: '서울 서초구',
        memo: '테스트 메모 2',
        joinDate: '2024-03-20',
        job: 'PO' as const,
        emailSubscription: false,
      });

      const result = await testService.deleteMultipleMembers([member1.id, member2.id]);
      expect(result).toBe(true);

      const members = await testService.getMembers();
      expect(members.find((m) => m.id === member1.id)).toBeUndefined();
      expect(members.find((m) => m.id === member2.id)).toBeUndefined();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });
});
