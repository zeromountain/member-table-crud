import { useState } from 'react';

import { Button, Form, Input, Select, Switch } from 'antd';

import { useFieldManager } from '@/hooks/useFieldManager';
import type { FieldProps } from '@/types/field';
import { FieldTypeEnum } from '@/utils/field';

interface FieldFormProps {
  initialValues?: FieldProps;
  onSubmit?: (values: FieldProps) => void;
  onCancel?: () => void;
}

export const FieldForm = ({ initialValues, onSubmit, onCancel }: FieldFormProps) => {
  const [form] = Form.useForm<FieldProps>();
  const { validateField } = useFieldManager();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (values: FieldProps) => {
    const fieldErrors = validateField(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(Object.values(fieldErrors).flat());
      return;
    }
    onSubmit?.(values);
  };

  return (
    <Form form={form} initialValues={initialValues} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="필드 타입"
        name="type"
        rules={[{ required: true, message: '필드 타입은 필수값입니다.' }]}
      >
        <Select>
          <Select.Option value={FieldTypeEnum.TEXT}>텍스트</Select.Option>
          <Select.Option value={FieldTypeEnum.TEXTAREA}>텍스트 영역</Select.Option>
          <Select.Option value={FieldTypeEnum.DATE}>날짜</Select.Option>
          <Select.Option value={FieldTypeEnum.SELECT}>선택</Select.Option>
          <Select.Option value={FieldTypeEnum.CHECKBOX}>체크박스</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="레이블"
        name="label"
        rules={[{ required: true, message: '레이블은 필수값입니다.' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="필수 여부" name="required" valuePropName="checked" initialValue={false}>
        <Switch />
      </Form.Item>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? '수정' : '추가'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            취소
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
