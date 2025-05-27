import { type Control, Controller, type FieldErrors } from 'react-hook-form';

import { Checkbox, DatePicker, Input, Select } from 'antd';

import type { Field } from '@/types/field';
import type { FormValues } from '@/types/form';

export const useMemberFormUtil = () => {
  // 유효성 검사 규칙
  const getValidationRules = (field: Field) => {
    const baseRules = {
      text: {
        maxLength: {
          value: 20,
          message: `글자수 20을 초과할 수 없습니다`,
        },
      },
      textarea: {
        maxLength: {
          value: 50,
          message: `글자수 50을 초과할 수 없습니다`,
        },
      },
    };

    const rules =
      field.type === 'text' ? baseRules.text : field.type === 'textarea' ? baseRules.textarea : {};

    if (field.required) {
      return {
        required: `${field.label}${field.type === 'select' ? '을(를) 선택해주세요' : '은 필수값입니다.'}`,
        ...rules,
      };
    }

    return rules;
  };

  // 필드 타입별 컴포넌트 렌더링
  const renderFieldInput = (
    field: Field,
    fieldId: keyof FormValues,
    control: Control<FormValues>,
    errors: FieldErrors<FormValues>,
  ) => {
    const commonProps = {
      name: fieldId,
      control,
      rules: getValidationRules(field),
    };

    switch (field.type) {
      case 'text':
        return (
          <Controller
            {...commonProps}
            render={({ field: inputField }) => (
              <Input
                {...inputField}
                value={typeof inputField.value === 'string' ? inputField.value : ''}
                status={errors[fieldId] ? 'error' : ''}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Controller
            {...commonProps}
            render={({ field: inputField }) => (
              <Input.TextArea
                {...inputField}
                value={typeof inputField.value === 'string' ? inputField.value : ''}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            {...commonProps}
            render={({ field: inputField }) => (
              <DatePicker
                {...inputField}
                style={{ width: '160px', height: '32px' }}
                status={errors[fieldId] ? 'error' : ''}
              />
            )}
          />
        );
      case 'select':
        return (
          <Controller
            {...commonProps}
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
      case 'checkbox':
        return (
          <Controller
            {...commonProps}
            render={({ field: { value, onChange } }) => (
              <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            )}
          />
        );
      default:
        return null;
    }
  };

  return {
    renderFieldInput,
  };
};
