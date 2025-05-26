import dayjs from 'dayjs';

import { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Checkbox, DatePicker, Input, Modal, Select, Typography } from 'antd';

import { useMemberStore } from '@/store/memberStore';
import type { Field } from '@/types/field';
import { defaultFields } from '@/types/field';
import type { Record as MemberRecord } from '@/types/record';

interface FormValues extends Omit<MemberRecord, 'joinDate'> {
  joinDate: dayjs.Dayjs;
}

interface MemberFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: MemberRecord;
  onCancel: () => void;
}

export const MemberFormModal = ({ open, mode, initialValues, onCancel }: MemberFormModalProps) => {
  const [fields] = useState<Field[]>(defaultFields);
  const { addMember, updateMember } = useMemberStore();

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      address: '',
      memo: '',
      job: undefined,
      emailSubscription: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        joinDate: dayjs(initialValues.joinDate),
      };

      reset(formattedValues as unknown as FormValues);
    } else {
      reset({
        name: '',
        address: '',
        memo: '',
        job: undefined,
        emailSubscription: false,
      });
    }
  }, [initialValues, reset]);

  const onSubmitHandler = handleSubmit(async (data) => {
    try {
      // joinDate를 문자열로 변환
      const memberData = {
        ...data,
        joinDate: data.joinDate.format('YYYY-MM-DD'),
      };

      if (mode === 'create') {
        // 신규 회원 추가
        await addMember(memberData);
      } else if (initialValues?.id) {
        // 기존 회원 수정
        await updateMember(initialValues.id, memberData);
      }

      // 모달 닫기
      onCancel();
    } catch (error) {
      console.error('회원 처리 중 오류가 발생했습니다:', error);
    }
  });

  const handleCancel = () => {
    // 폼 상태 초기화
    reset({
      name: '',
      address: '',
      memo: '',
      job: undefined,
      emailSubscription: false,
      joinDate: undefined,
    });
    clearErrors();

    // 부모 컴포넌트의 onCancel 호출
    onCancel();
  };

  // label과 input 간격을 위한 스타일
  const labelStyle = { marginBottom: '6px', display: 'block' };
  const formItemStyle = { marginBottom: '16px' };
  const requiredMark = <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>;

  // 버튼 비활성화 여부
  const isButtonDisabled = mode === 'edit' ? !isDirty : !isValid;

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
          // 필드 ID를 FormValues의 키로 안전하게 캐스팅
          const fieldId = field.id as keyof FormValues;

          // 필드 타입에 따라 다른 컴포넌트 렌더링
          let fieldInput;
          switch (field.type) {
            case 'text':
              fieldInput = (
                <Controller
                  name={fieldId}
                  control={control}
                  rules={
                    field.required
                      ? {
                          required: `${field.label}은 필수값입니다.`,
                          maxLength: {
                            value: 20,
                            message: `${field.label}은(는) 20글자를 초과할 수 없습니다`,
                          },
                        }
                      : {
                          maxLength: {
                            value: 20,
                            message: `${field.label}은(는) 20글자를 초과할 수 없습니다`,
                          },
                        }
                  }
                  render={({ field: inputField }) => (
                    <Input
                      {...inputField}
                      value={typeof inputField.value === 'string' ? inputField.value : ''}
                      status={errors[fieldId] ? 'error' : ''}
                    />
                  )}
                />
              );
              break;
            case 'textarea':
              fieldInput = (
                <Controller
                  name={fieldId}
                  control={control}
                  rules={
                    field.required
                      ? {
                          required: `${field.label}을(를) 입력해주세요`,
                          maxLength: {
                            value: 50,
                            message: `${field.label}은(는) 50글자를 초과할 수 없습니다`,
                          },
                        }
                      : {
                          maxLength: {
                            value: 50,
                            message: `${field.label}은(는) 50글자를 초과할 수 없습니다`,
                          },
                        }
                  }
                  render={({ field: inputField }) => (
                    <Input.TextArea
                      {...inputField}
                      value={typeof inputField.value === 'string' ? inputField.value : ''}
                    />
                  )}
                />
              );
              break;
            case 'date':
              fieldInput = (
                <Controller
                  name={fieldId}
                  control={control}
                  rules={field.required ? { required: `${field.label}을(를) 선택해주세요` } : {}}
                  render={({ field: inputField }) => (
                    <DatePicker
                      {...inputField}
                      style={{ width: '160px', height: '32px' }}
                      status={errors[fieldId] ? 'error' : ''}
                    />
                  )}
                />
              );
              break;
            case 'select':
              fieldInput = (
                <Controller
                  name={fieldId}
                  control={control}
                  rules={field.required ? { required: `${field.label}을(를) 선택해주세요` } : {}}
                  render={({ field: inputField }) => (
                    <Select
                      {...inputField}
                      style={{ width: '320px' }}
                      status={errors[fieldId] ? 'error' : ''}
                    >
                      {field.options?.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              );
              break;
            case 'checkbox':
              fieldInput = (
                <Controller
                  name={fieldId}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} />
                  )}
                />
              );
              break;
            default:
              fieldInput = null;
          }

          return (
            <div key={field.id} style={formItemStyle}>
              <label style={labelStyle}>
                {field.label}
                {field.required && requiredMark}
              </label>
              {fieldInput}
              {errors[fieldId] && (
                <Typography.Text
                  type="danger"
                  style={{
                    fontSize: '12px',
                  }}
                >
                  {errors[fieldId]?.message}
                </Typography.Text>
              )}
            </div>
          );
        })}
      </form>
    </Modal>
  );
};
