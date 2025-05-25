import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { z } from 'zod';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export const FieldTypeEnum = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
} as const;

export const JobEnum = {
  DEVELOPER: '개발자',
  PO: 'PO',
  DESIGNER: '디자이너',
} as const;

export const fieldSchema = z.object({
  type: z.enum([
    FieldTypeEnum.TEXT,
    FieldTypeEnum.TEXTAREA,
    FieldTypeEnum.DATE,
    FieldTypeEnum.SELECT,
    FieldTypeEnum.CHECKBOX,
  ]),
  label: z.string().min(1),
  required: z.boolean(),
});

const isValidDate = (dateStr: string) => {
  const date = dayjs(dateStr, 'YYYY-MM-DD', true);
  return date.isValid();
};

export const textFieldValueSchema = z
  .string()
  .max(20, { message: '글자수 20을 초과할 수 없습니다.' });
export const textareaFieldValueSchema = z
  .string()
  .max(50, { message: '글자수 50을 초과할 수 없습니다.' });
export const dateFieldValueSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다')
  .refine(isValidDate, '유효한 날짜가 아닙니다');
export const selectFieldValueSchema = z.enum([JobEnum.DEVELOPER, JobEnum.PO, JobEnum.DESIGNER]);
export const checkboxFieldValueSchema = z.boolean();

export type Field = z.infer<typeof fieldSchema>;
export type FieldType = keyof typeof FieldTypeEnum;
export type Job = keyof typeof JobEnum;
