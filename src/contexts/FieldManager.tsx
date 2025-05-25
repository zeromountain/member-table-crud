import { v4 as uuidv4 } from 'uuid';

import { createContext, useState } from 'react';

import { defaultFields } from '@/constants/fields';
import type { FieldErrors, FieldManagerContextType, FieldProps, FieldState } from '@/types/field';
import { fieldSchema } from '@/utils/field';

export const FieldManagerContext = createContext<FieldManagerContextType | undefined>(undefined);

export const FieldManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [fields, setFields] = useState<FieldState[]>(defaultFields);

  const addField = (field: FieldProps) => {
    const newField: FieldState = {
      ...field,
      id: uuidv4(),
      value: field.type === 'checkbox' ? false : '',
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (id: string, field: Partial<FieldProps>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...field } : f)));
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const validateField = (field: FieldProps): FieldErrors => {
    try {
      fieldSchema.parse(field);
      return {};
    } catch (error) {
      if (error instanceof Error) {
        return {
          type: ['유효하지 않은 필드 타입입니다.'],
          label: ['레이블은 필수값입니다.'],
        };
      }
      return {};
    }
  };

  const value: FieldManagerContextType = {
    fields,
    addField,
    updateField,
    deleteField,
    validateField,
  };

  return <FieldManagerContext.Provider value={value}>{children}</FieldManagerContext.Provider>;
};
