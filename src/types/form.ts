import type dayjs from 'dayjs';

import type { Record } from '@/types/record';

export interface FormValues extends Omit<Record, 'joinDate'> {
  joinDate: dayjs.Dayjs;
}
