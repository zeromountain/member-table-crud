import { z } from 'zod';

// 필드 타입 정의
export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'checkbox';

// 필드 인터페이스
export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[]; // select 타입에서 사용할 옵션들
}

// 필드 값 검증을 위한 Zod 스키마
export const textFieldValueSchema = z
  .string()
  .max(20, { message: '텍스트는 20글자를 초과할 수 없습니다.' });

export const textareaFieldValueSchema = z
  .string()
  .max(50, { message: '텍스트 영역은 50글자를 초과할 수 없습니다.' });

export const dateFieldValueSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: '날짜 형식은 YYYY-MM-DD 여야 합니다.',
});

export const selectFieldValueSchema = z.enum(['개발자', 'PO', '디자이너']);

export const checkboxFieldValueSchema = z.boolean();

// 필드 옵션 인터페이스
export interface FieldOption {
  label: string;
  value: string;
}

// 필드 속성 인터페이스
export interface FieldProps {
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[];
}

// 필드 상태 인터페이스
export interface FieldState extends FieldProps {
  id: string;
  value: string | boolean | string; // 값 타입
}

export type FieldErrors = Partial<Record<keyof FieldProps, string[]>>;

// 필드 관리자 컨텍스트 타입
export interface FieldManagerContextType {
  fields: FieldState[];
  addField: (field: FieldProps) => void;
  updateField: (id: string, field: Partial<FieldProps>) => void;
  deleteField: (id: string) => void;
  validateField: (field: FieldProps) => FieldErrors;
}

// 기본 필드 정의
export const defaultFields: Field[] = [
  {
    id: 'name',
    type: 'text',
    label: '이름',
    required: true,
  },
  {
    id: 'address',
    type: 'text',
    label: '주소',
    required: false,
  },
  {
    id: 'memo',
    type: 'textarea',
    label: '메모',
    required: false,
  },
  {
    id: 'joinDate',
    type: 'date',
    label: '가입일',
    required: true,
  },
  {
    id: 'job',
    type: 'select',
    label: '직업',
    required: false,
    options: ['개발자', 'PO', '디자이너'],
  },
  {
    id: 'emailSubscription',
    type: 'checkbox',
    label: '이메일 수신 동의',
    required: false,
  },
];
