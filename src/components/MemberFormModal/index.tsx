import dayjs from 'dayjs';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { Modal } from 'antd';

import { DEFAULT_FORM_VALUES } from '@/constants/form';
import { useMemberStore } from '@/store/memberStore';
import type { Field } from '@/types/field';
import { defaultFields } from '@/types/field';
import type { FormValues } from '@/types/form';
import type { Record as MemberRecord } from '@/types/record';

import { ErrorText } from '../common/ErrorText';
import { useMemberFormUtil } from './_hooks/useMemberFormUtil';
import { Box, Label, RequiredMark } from './style';

interface MemberFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: MemberRecord;
  onCancel: () => void;
}

export const MemberFormModal = ({ open, mode, initialValues, onCancel }: MemberFormModalProps) => {
  const [fields] = useState<Field[]>(defaultFields);
  const { addMember, updateMember } = useMemberStore();

  const { renderFieldInput } = useMemberFormUtil();

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  // 버튼 비활성화 여부
  const isButtonDisabled = mode === 'edit' ? !isDirty : !isValid;

  const onSubmitHandler = handleSubmit(async (data) => {
    try {
      const memberData = {
        ...data,
        joinDate: data.joinDate.format('YYYY-MM-DD'),
      };

      if (mode === 'create') {
        await addMember(memberData);
      } else if (initialValues?.id) {
        await updateMember(initialValues.id, memberData);
      }

      handleCancel();
    } catch (error) {
      console.error('회원 처리 중 오류가 발생했습니다:', error);
    }
  });

  const handleCancel = () => {
    reset(DEFAULT_FORM_VALUES);
    clearErrors();
    onCancel();
  };

  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        joinDate: dayjs(initialValues.joinDate),
      };
      reset(formattedValues as unknown as FormValues);
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [initialValues, reset]);

  return (
    <Modal
      title={mode === 'create' ? '회원 추가' : '회원 수정'}
      open={open}
      onCancel={handleCancel}
      onOk={onSubmitHandler}
      okText={mode === 'create' ? '추가' : '수정'}
      okButtonProps={{ disabled: isButtonDisabled }}
      cancelText="취소"
    >
      <form>
        {fields.map((field) => {
          const fieldId = field.id as keyof FormValues;
          return (
            <Box key={field.id}>
              <Label>
                {field.label}
                {field.required && <RequiredMark>*</RequiredMark>}
              </Label>
              {renderFieldInput(field, fieldId, control, errors)}
              {errors[fieldId] && <ErrorText>{errors[fieldId]?.message}</ErrorText>}
            </Box>
          );
        })}
      </form>
    </Modal>
  );
};
