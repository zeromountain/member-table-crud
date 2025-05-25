import { useContext } from 'react';

import { FieldManagerContext } from '@/contexts/FieldManager';

export const useFieldManager = () => {
  const context = useContext(FieldManagerContext);
  if (!context) {
    throw new Error('useFieldManager must be used within a FieldManagerProvider');
  }
  return context;
};
