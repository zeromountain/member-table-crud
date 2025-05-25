import { describe, expect, it } from 'vitest';

import {
  FieldTypeEnum,
  JobEnum,
  checkboxFieldValueSchema,
  dateFieldValueSchema,
  fieldSchema,
  selectFieldValueSchema,
  textFieldValueSchema,
  textareaFieldValueSchema,
} from '../field';

describe('Field Schemas', () => {
  describe('fieldSchema', () => {
    it('should validate correct field', () => {
      const field = {
        type: FieldTypeEnum.TEXT,
        label: '이름',
        required: true,
      };

      expect(() => fieldSchema.parse(field)).not.toThrow();
    });

    it('should throw error for invalid type', () => {
      const field = {
        type: 'invalid',
        label: '이름',
        required: true,
      };

      expect(() => fieldSchema.parse(field)).toThrow();
    });

    it('should throw error for empty label', () => {
      const field = {
        type: FieldTypeEnum.TEXT,
        label: '',
        required: true,
      };

      expect(() => fieldSchema.parse(field)).toThrow();
    });
  });

  describe('Field Value Schemas', () => {
    describe('textFieldValueSchema', () => {
      it('should validate text within 20 characters', () => {
        const value = '20자 이내의 텍스트입니다';
        expect(() => textFieldValueSchema.parse(value)).not.toThrow();
      });

      it('should throw error for text exceeding 20 characters', () => {
        const value = '이 텍스트는 20자를 초과하는 매우 긴 텍스트입니다';
        expect(() => textFieldValueSchema.parse(value)).toThrow();
      });
    });

    describe('textareaFieldValueSchema', () => {
      it('should validate text within 50 characters', () => {
        const value = '50자 이내의 텍스트입니다. 텍스트에리어 필드 값 검증 테스트입니다.';
        expect(() => textareaFieldValueSchema.parse(value)).not.toThrow();
      });

      it('should throw error for text exceeding 50 characters', () => {
        const value =
          '이 텍스트는 50자를 초과하는 매우 긴 텍스트입니다. 텍스트에리어 필드의 최대 길이 제한을 테스트하기 위한 텍스트입니다.';
        expect(() => textareaFieldValueSchema.parse(value)).toThrow();
      });
    });

    describe('dateFieldValueSchema', () => {
      it('should validate correct date string', () => {
        const validDates = [
          '2024-10-02',
          '2024-02-29', // 윤년
          '2024-12-31',
        ];

        validDates.forEach((date) => {
          expect(() => dateFieldValueSchema.parse(date)).not.toThrow();
        });
      });

      it('should throw error for invalid date format', () => {
        const invalidFormats = ['invalid-date', '2024/10/02', '02-10-2024', '2024-1-1', '24-10-02'];

        invalidFormats.forEach((date) => {
          expect(() => dateFieldValueSchema.parse(date)).toThrow();
        });
      });

      it('should throw error for invalid dates', () => {
        const invalidDates = [
          '2024-02-30', // 존재하지 않는 날짜
          '2024-04-31', // 30일까지만 있는 달
          '2023-02-29', // 윤년이 아닌 해의 2월 29일
        ];

        invalidDates.forEach((date) => {
          expect(() => dateFieldValueSchema.parse(date)).toThrow();
        });
      });
    });

    describe('selectFieldValueSchema', () => {
      it('should validate correct job value', () => {
        const value = JobEnum.DEVELOPER;
        expect(() => selectFieldValueSchema.parse(value)).not.toThrow();
      });

      it('should throw error for invalid job value', () => {
        const value = 'invalid-job';
        expect(() => selectFieldValueSchema.parse(value)).toThrow();
      });
    });

    describe('checkboxFieldValueSchema', () => {
      it('should validate boolean value', () => {
        expect(() => checkboxFieldValueSchema.parse(true)).not.toThrow();
        expect(() => checkboxFieldValueSchema.parse(false)).not.toThrow();
      });

      it('should throw error for non-boolean value', () => {
        expect(() => checkboxFieldValueSchema.parse('true')).toThrow();
      });
    });
  });
});
