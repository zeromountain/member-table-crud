import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';

import { Modal, Table } from 'antd';

import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { TableContainer } from '@/components/common/TableContainer';
import { useMemberColumns } from '@/hooks/useMemberColumns';
import { useMemberModal } from '@/hooks/useMemberModal';
import { useMemberStore } from '@/store/memberStore';
import { defaultFields } from '@/types/field';
import type { Record as MemberRecord, RecordWithCustomFields } from '@/types/record';

import { MemberFormModal } from './MemberFormModal';

// Member 인터페이스를 Record 타입에 맞게 수정
export interface Member extends Omit<MemberRecord, 'job' | 'emailSubscription'> {
  key: string;
  position: string; // job과 매핑
  isReceivingEmails: boolean; // emailSubscription과 매핑
}

export const MemberList = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
}) => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});

  const { members, isLoading, error, fetchMembers, deleteMember } = useMemberStore();
  const { modalOpen, modalMode, editingMember, openEditModal, closeModal } = useMemberModal();

  // 회원 데이터를 RecordWithCustomFields로 변환
  const memberRecords = useMemo<RecordWithCustomFields[]>(() => {
    // 회원 데이터가 없으면 빈 배열 반환
    if (!members || members.length === 0) {
      return [];
    }

    // 데이터 복사 및 변환
    return members.map((member) => {
      // member가 null이거나 undefined인 경우 처리
      if (!member) return {} as RecordWithCustomFields;

      // 깊은 복사를 통해 데이터 변환
      const record: RecordWithCustomFields = { ...member };

      // 필드가 undefined인 경우 빈 값으로 초기화
      defaultFields.forEach((field) => {
        if (record[field.id] === undefined) {
          if (field.type === 'checkbox') {
            record[field.id] = false;
          } else if (field.type === 'date') {
            record[field.id] = '';
          } else {
            record[field.id] = '';
          }
        }
      });

      return record;
    });
  }, [members]);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('Members:', members);
    console.log('Member Records:', memberRecords);
  }, [members, memberRecords]);

  // 컴포넌트 마운트 시 회원 목록 조회
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
  ) => {
    setFilteredInfo(filters);
  };

  const handleDelete = (record: MemberRecord) => {
    Modal.confirm({
      title: '회원 삭제',
      content: `${record.name} 회원을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteMember(record.id);
        } catch (error) {
          console.error('회원 삭제 중 오류가 발생했습니다:', error);
        }
      },
    });
  };

  // 커스텀 훅을 사용하여 컬럼 생성
  const columns = useMemberColumns(filteredInfo, memberRecords, openEditModal, handleDelete);

  return (
    <TableContainer>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

      <Table<RecordWithCustomFields>
        columns={columns}
        dataSource={memberRecords}
        loading={isLoading}
        onChange={handleChange}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        pagination={{
          total: memberRecords.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <MemberFormModal
        open={modalOpen}
        mode={modalMode}
        initialValues={editingMember}
        onCancel={closeModal}
      />
    </TableContainer>
  );
};
