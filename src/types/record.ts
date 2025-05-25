import { z } from 'zod';

import {
  checkboxFieldValueSchema,
  dateFieldValueSchema,
  selectFieldValueSchema,
  textFieldValueSchema,
  textareaFieldValueSchema,
} from './field';

// 레코드 타입 정의 - 필드의 집합
export const recordSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string({
      required_error: '이름은 필수값입니다.',
      invalid_type_error: '이름은 문자열이어야 합니다.',
    })
    .min(1, { message: '이름은 필수값입니다.' })
    .max(20, { message: '이름은 20글자를 초과할 수 없습니다.' }),
  address: textFieldValueSchema.optional(),
  memo: textareaFieldValueSchema.optional(),
  joinDate: dateFieldValueSchema,
  job: selectFieldValueSchema.optional(),
  emailSubscription: checkboxFieldValueSchema.optional(),
});

// 레코드 타입 추출
export type Record = z.infer<typeof recordSchema>;

// 기본 레코드 데이터
export const defaultRecords: Record[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    address: '서울 강남구',
    memo: '외국인',
    joinDate: '2024-10-02',
    job: '개발자',
    emailSubscription: true,
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Foo Bar',
    address: '서울 서초구',
    memo: '한국인',
    joinDate: '2024-10-01',
    job: 'PO',
    emailSubscription: false,
  },
];

// 새 레코드 생성 시 기본값
export const emptyRecord: Omit<Record, 'id'> = {
  name: '',
  address: '',
  memo: '',
  joinDate: new Date().toISOString().split('T')[0], // 오늘 날짜
  job: undefined,
  emailSubscription: false,
};

// 커스텀 필드를 포함한 레코드 타입 (확장성을 위해)
export interface RecordWithCustomFields extends Record {
  [key: string]: string | boolean | undefined;
}
