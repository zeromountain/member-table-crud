type Field = {
  type: string;
  label: string;
  required: boolean;
};

export const defaultFields: Field[] = [
  {
    type: 'text',
    label: '이름',
    required: true,
  },
  {
    type: 'text',
    label: '주소',
    required: false,
  },
  {
    type: 'textarea',
    label: '메모',
    required: false,
  },
  {
    type: 'date',
    label: '가입일',
    required: true,
  },
  {
    type: 'select',
    label: '직업',
    required: false,
  },
  {
    type: 'checkbox',
    label: '이메일 수신 동의',
    required: false,
  },
];
