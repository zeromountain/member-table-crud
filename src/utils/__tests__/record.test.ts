import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import { defaultRecord, recordSchema } from '../record';

describe('Record Schema', () => {
  it('should validate correct record', () => {
    const record = {
      id: uuidv4(),
      ...defaultRecord,
    };

    expect(() => recordSchema.parse(record)).not.toThrow();
  });

  it('should throw error with correct message for missing name field', () => {
    const record = {
      id: uuidv4(),
      address: '서울 강남구',
      memo: '외국인',
      joinDate: '2024-10-02',
      job: '개발자',
      emailSubscription: true,
    };

    try {
      recordSchema.parse(record);
    } catch (error) {
      const zodError = error as ZodError;
      expect(zodError.errors[0].message).toBe('이름은 필수값입니다.');
    }
  });

  it('should validate record with only required fields', () => {
    const record = {
      id: uuidv4(),
      name: 'John Doe',
      joinDate: '2024-10-02',
    };

    expect(() => recordSchema.parse(record)).not.toThrow();
  });

  it('should throw error with correct message for invalid name length', () => {
    const record = {
      id: uuidv4(),
      name: '이 이름은 20자를 초과하는 매우 긴 이름입니다',
      joinDate: '2024-10-02',
    };

    try {
      recordSchema.parse(record);
    } catch (error) {
      const zodError = error as ZodError;
      expect(zodError.errors[0].message).toBe('글자수 20을 초과할 수 없습니다.');
    }
  });

  it('should throw error with correct message for invalid address length', () => {
    const record = {
      id: uuidv4(),
      name: 'John Doe',
      address: '이 주소는 20자를 초과하는 매우 긴 주소입니다 더 길게 작성해보겠습니다',
      joinDate: '2024-10-02',
    };

    try {
      recordSchema.parse(record);
    } catch (error) {
      const zodError = error as ZodError;
      expect(zodError.errors[0].message).toBe('글자수 20을 초과할 수 없습니다.');
    }
  });

  it('should throw error with correct message for invalid memo length', () => {
    const record = {
      id: uuidv4(),
      name: 'John Doe',
      joinDate: '2024-10-02',
      memo: '이 메모는 50자를 초과하는 매우 긴 메모입니다. 텍스트에리어 필드의 최대 길이 제한을 테스트하기 위한 메모입니다.',
    };

    try {
      recordSchema.parse(record);
    } catch (error) {
      const zodError = error as ZodError;
      expect(zodError.errors[0].message).toBe('글자수 50을 초과할 수 없습니다.');
    }
  });

  it('should throw error for invalid job value', () => {
    const record = {
      id: uuidv4(),
      name: 'John Doe',
      joinDate: '2024-10-02',
      job: '무직',
    };

    expect(() => recordSchema.parse(record)).toThrow();
  });

  it('should throw error for invalid date format', () => {
    const record = {
      id: uuidv4(),
      name: 'John Doe',
      joinDate: 'invalid-date',
    };

    expect(() => recordSchema.parse(record)).toThrow();
  });
});
