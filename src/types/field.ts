import { z } from 'zod';

import { fieldSchema } from '@/utils/field';
import type { FieldType, Job } from '@/utils/field';

export type Field = z.infer<typeof fieldSchema>;

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldProps {
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[];
}

export interface FieldState extends FieldProps {
  id: string;
  value: string | boolean | Job;
}

export type FieldErrors = Partial<Record<keyof FieldProps, string[]>>;

export interface FieldManagerContextType {
  fields: FieldState[];
  addField: (field: FieldProps) => void;
  updateField: (id: string, field: Partial<FieldProps>) => void;
  deleteField: (id: string) => void;
  validateField: (field: FieldProps) => FieldErrors;
}
