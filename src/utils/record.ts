import { z } from 'zod';

import {
  checkboxFieldValueSchema,
  dateFieldValueSchema,
  selectFieldValueSchema,
  textFieldValueSchema,
  textareaFieldValueSchema,
} from './field';

export const recordSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string({
      required_error: '이름은 필수값입니다.',
      invalid_type_error: '이름은 문자열이어야 합니다.',
    })
    .min(1, { message: '이름은 필수값입니다.' })
    .max(20, { message: '글자수 20을 초과할 수 없습니다.' }),
  address: textFieldValueSchema.optional(),
  memo: textareaFieldValueSchema.optional(),
  joinDate: dateFieldValueSchema,
  job: selectFieldValueSchema.optional(),
  emailSubscription: checkboxFieldValueSchema.optional(),
});

export type Record = z.infer<typeof recordSchema>;

export const defaultRecord: Omit<Record, 'id'> = {
  name: 'John Doe',
  address: '서울 강남구',
  memo: '외국인',
  joinDate: '2024-10-02',
  job: '개발자',
  emailSubscription: true,
};
