import dayjs from 'dayjs';

import { useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Checkbox, DatePicker, Input, Modal, Select } from 'antd';

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
  onSubmit: (values: Omit<MemberRecord, 'id'>) => void;
}

export const MemberFormModal = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: MemberFormModalProps) => {
  const [fields] = useState<Field[]>(defaultFields);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      address: '',
      memo: '',
      job: undefined,
      emailSubscription: false,
    },
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
  }, [reset, initialValues]);

  const onSubmitHandler = handleSubmit((data) => {
    onSubmit({
      ...data,
      joinDate: data.joinDate.format('YYYY-MM-DD'),
    });
  });

  // label과 input 간격을 위한 스타일
  const labelStyle = { marginBottom: '6px', display: 'block' };
  const formItemStyle = { marginBottom: '16px' };
  const requiredMark = <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>;

  return (
    <Modal
      title={mode === 'create' ? '회원 추가' : '회원 수정'}
      open={open}
      onCancel={onCancel}
      onOk={onSubmitHandler}
      okText={mode === 'create' ? '추가' : '수정'}
      okButtonProps={{ disabled: mode === 'edit' && !isDirty }}
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
                          required: `${field.label}을(를) 입력해주세요`,
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
                      width="100%"
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
                      style={{ width: '100%' }}
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
                    <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)}>
                      {field.label}
                    </Checkbox>
                  )}
                />
              );
              break;
            default:
              fieldInput = null;
          }

          return (
            <div key={field.id} style={formItemStyle}>
              {field.type !== 'checkbox' && (
                <label style={labelStyle}>
                  {field.label}
                  {field.required && requiredMark}
                </label>
              )}
              {fieldInput}
              {errors[fieldId] && (
                <span className="text-red-500 text-sm">{errors[fieldId]?.message}</span>
              )}
            </div>
          );
        })}
      </form>
    </Modal>
  );
};
