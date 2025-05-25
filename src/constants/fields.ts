import { v4 as uuidv4 } from 'uuid';

import type { FieldState } from '@/types/field';

export const defaultFields: FieldState[] = [
  {
    id: uuidv4(),
    type: 'TEXT',
    label: '이름',
    required: true,
    value: '',
  },
  {
    id: uuidv4(),
    type: 'SELECT',
    label: '직무',
    required: true,
    value: '',
  },
  {
    id: uuidv4(),
    type: 'DATE',
    label: '입사일',
    required: true,
    value: '',
  },
  {
    id: uuidv4(),
    type: 'TEXTAREA',
    label: '메모',
    required: false,
    value: '',
  },
];
