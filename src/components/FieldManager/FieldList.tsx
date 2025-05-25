import { useState } from 'react';

import { Button, List, Modal, Typography } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useFieldManager } from '@/hooks/useFieldManager';
import type { FieldProps, FieldState } from '@/types/field';

import { FieldForm } from './FieldForm';

export const FieldList = () => {
  const { fields, updateField, deleteField } = useFieldManager();
  const [editingField, setEditingField] = useState<FieldState | null>(null);

  const handleEdit = (field: FieldState) => {
    setEditingField(field);
  };

  const handleEditSubmit = (values: FieldProps) => {
    if (editingField) {
      updateField(editingField.id, values);
      setEditingField(null);
    }
  };

  const handleDelete = (field: FieldState) => {
    Modal.confirm({
      title: '필드 삭제',
      content: `"${field.label}" 필드를 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: () => deleteField(field.id),
    });
  };

  return (
    <>
      <List
        dataSource={fields}
        renderItem={(field) => (
          <List.Item
            actions={[
              <Button key="edit" icon={<EditOutlined />} onClick={() => handleEdit(field)}>
                수정
              </Button>,
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(field)}
              >
                삭제
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={field.label}
              description={
                <>
                  <Typography.Text type="secondary">타입: {field.type}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    필수: {field.required ? '예' : '아니오'}
                  </Typography.Text>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="필드 수정"
        open={!!editingField}
        footer={null}
        onCancel={() => setEditingField(null)}
      >
        {editingField && (
          <FieldForm
            initialValues={editingField}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingField(null)}
          />
        )}
      </Modal>
    </>
  );
};
