import { useEffect, useState } from 'react';

import { Checkbox, Dropdown, Modal, Table } from 'antd';

import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { MoreOutlined } from '@ant-design/icons';

import { ActionButton } from '@/components/common/ActionButton';
import { TableContainer } from '@/components/common/TableContainer';
import { useMemberModal } from '@/hooks/useMemberModal';
import { useMemberStore } from '@/store/memberStore';
import type { Record as MemberRecord } from '@/types/record';

import { FilterDropdown } from './FilterDropdown';
import { MemberFormModal } from './MemberFormModal';

// Member 인터페이스를 Record 타입에 맞게 수정
export interface Member extends Omit<MemberRecord, 'job' | 'emailSubscription'> {
  key: string;
  position: string; // job과 매핑
  isReceivingEmails: boolean; // emailSubscription과 매핑
}

export const MemberList = () => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { members, isLoading, error, fetchMembers, deleteMember, deleteMultipleMembers } =
    useMemberStore();
  const { modalOpen, modalMode, editingMember, openEditModal, closeModal } = useMemberModal();

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

  const handleDeleteSelected = () => {
    if (!selectedRowKeys.length) return;

    Modal.confirm({
      title: '선택한 회원 삭제',
      content: `선택한 ${selectedRowKeys.length}명의 회원을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteMultipleMembers(selectedRowKeys as string[]);
          setSelectedRowKeys([]);
        } catch (error) {
          console.error('회원 일괄 삭제 중 오류가 발생했습니다:', error);
        }
      },
    });
  };

  const getUniqueValues = (dataIndex: keyof MemberRecord) => {
    return Array.from(new Set(members.map((item) => String(item[dataIndex] || ''))));
  };

  const columns: ColumnsType<MemberRecord> = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value.toString()),
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('name')} />,
    },
    {
      title: '주소',
      dataIndex: 'address',
      key: 'address',
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address?.includes(value.toString()) || false,
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('address')} />,
    },
    {
      title: '메모',
      dataIndex: 'memo',
      key: 'memo',
      filteredValue: filteredInfo.memo || null,
      onFilter: (value, record) => record.memo === value,
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('memo')} />,
    },
    {
      title: '가입일',
      dataIndex: 'joinDate',
      key: 'joinDate',
      filteredValue: filteredInfo.joinDate || null,
      onFilter: (value, record) => record.joinDate === value,
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('joinDate')} />,
    },
    {
      title: '직업',
      dataIndex: 'job',
      key: 'job',
      filteredValue: filteredInfo.job || null,
      onFilter: (value, record) => record.job === value,
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('job')} />,
    },
    {
      title: '이메일 수신 동의',
      dataIndex: 'emailSubscription',
      key: 'emailSubscription',
      filteredValue: filteredInfo.emailSubscription || null,
      onFilter: (value, record) => {
        if (value === '선택됨') return record.emailSubscription === true;
        if (value === '선택 안함') return record.emailSubscription === false;
        return false;
      },
      filterDropdown: (props) => <FilterDropdown {...props} values={['선택됨', '선택 안함']} />,
      render: (emailSubscription: boolean) => <Checkbox checked={emailSubscription} />,
    },
    {
      key: 'actions',
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '수정',
                onClick: () => openEditModal(record),
              },
              {
                key: 'delete',
                label: '삭제',
                danger: true,
                onClick: () => handleDelete(record),
              },
            ],
            style: { minWidth: 180 },
          }}
          trigger={['click']}
        >
          <ActionButton type="text" icon={<MoreOutlined />} width={32} height={32} radius="0px" />
        </Dropdown>
      ),
    },
  ];

  return (
    <TableContainer>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

      <Table<MemberRecord>
        columns={columns}
        dataSource={members}
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
          total: members.length,
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
