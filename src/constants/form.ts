import type { FormValues } from '@/types/form';

// 기본 폼 값
export const DEFAULT_FORM_VALUES: Partial<FormValues> = {
  name: '',
  address: '',
  memo: '',
  job: undefined,
  emailSubscription: false,
};
