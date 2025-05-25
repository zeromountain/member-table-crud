import { useState } from 'react';

import { Checkbox, Dropdown, Modal, Table } from 'antd';

import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { MoreOutlined } from '@ant-design/icons';

import { ActionButton } from '@/components/common/ActionButton';
import { TableContainer } from '@/components/common/TableContainer';

import { FilterDropdown } from './FilterDropdown';

export interface Member {
  key: string;
  name: string;
  address: string;
  memo: string;
  joinDate: string;
  position: string;
  isReceivingEmails: boolean;
}

const data: Member[] = [
  {
    key: '1',
    name: 'John Doe',
    address: '서울 강남구',
    memo: '외국인',
    joinDate: '2024-10-02',
    position: '개발자',
    isReceivingEmails: true,
  },
  {
    key: '2',
    name: 'Foo Bar',
    address: '서울 서구',
    memo: '한국인',
    joinDate: '2024-10-01',
    position: 'PO',
    isReceivingEmails: false,
  },
];

export const MemberList = () => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
  ) => {
    setFilteredInfo(filters);
  };

  const handleEdit = (record: Member) => {
    // TODO: 수정 기능 구현
    console.log('Edit:', record);
  };

  const handleDelete = (record: Member) => {
    Modal.confirm({
      title: '회원 삭제',
      content: `${record.name} 회원을 삭제하시겠습니까?`,
      okText: '삭제',
      cancelText: '취소',
      onOk: () => {
        // TODO: 삭제 기능 구현
        console.log('Delete:', record);
      },
    });
  };

  const getUniqueValues = (dataIndex: keyof Member) => {
    return Array.from(new Set(data.map((item) => String(item[dataIndex]))));
  };

  const columns: ColumnsType<Member> = [
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
      onFilter: (value, record) => record.address.includes(value.toString()),
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('address')} />,
    },
    {
      title: '국적',
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
      dataIndex: 'position',
      key: 'position',
      filteredValue: filteredInfo.position || null,
      onFilter: (value, record) => record.position === value,
      filterDropdown: (props) => <FilterDropdown {...props} values={getUniqueValues('position')} />,
    },
    {
      title: '이메일 수신 동의',
      dataIndex: 'isReceivingEmails',
      key: 'isReceivingEmails',
      filteredValue: filteredInfo.isReceivingEmails || null,
      onFilter: (value, record) => {
        if (value === '선택됨') return record.isReceivingEmails === true;
        if (value === '선택 안함') return record.isReceivingEmails === false;
        return false;
      },
      filterDropdown: (props) => <FilterDropdown {...props} values={['선택됨', '선택 안함']} />,
      render: (isReceivingEmails: boolean) => <Checkbox checked={isReceivingEmails} />,
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
                onClick: () => handleEdit(record),
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
      <Table<Member>
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </TableContainer>
  );
};
