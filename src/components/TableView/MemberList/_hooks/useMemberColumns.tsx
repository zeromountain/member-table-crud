import { useMemo } from 'react';

import { Dropdown } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, Key } from 'antd/es/table/interface';
import type { FilterDropdownProps } from 'antd/es/table/interface';

import { MoreOutlined } from '@ant-design/icons';

import { ActionButton } from '@/components/common/ActionButton';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { defaultFields } from '@/types/field';
import type { Record as MemberRecord, RecordWithCustomFields } from '@/types/record';

import { useMemberColumnsUtil } from './useMemberColumnsUtil';

/**
 * 회원 목록 테이블의 컬럼 정보를 생성하는 커스텀 훅
 *
 * @param filteredInfo 필터링 정보
 * @param memberRecords 회원 데이터 배열
 * @param openEditModal 수정 모달 오픈 함수
 * @param handleDelete 삭제 처리 함수
 * @returns 테이블 컬럼 정보
 */
export const useMemberColumns = (
  filteredInfo: Record<string, FilterValue | null>,
  memberRecords: RecordWithCustomFields[],
  openEditModal: (record: MemberRecord) => void,
  handleDelete: (record: MemberRecord) => void,
) => {
  const { getOptionValues, getUniqueValues, renderFieldValue, filterField, renderColumnTitle } =
    useMemberColumnsUtil();

  // 특정 필드에 대한 컬럼 생성 함수
  const createFieldColumn = (fieldId: string) => {
    const field = defaultFields.find((f) => f.id === fieldId);
    if (!field) return null;

    return {
      title: renderColumnTitle(field),
      dataIndex: field.id,
      key: field.id,
      filteredValue: filteredInfo[field.id] || null,
      onFilter: (value: boolean | Key, record: RecordWithCustomFields) =>
        filterField(value, record, field.id, field.type),
      filterDropdown: (props: FilterDropdownProps) => {
        if (field.type === 'checkbox') {
          return <FilterDropdown {...props} values={['선택됨', '선택 안함']} />;
        }
        if (field.type === 'select' && field.options) {
          // options 배열을 문자열 배열로 변환
          return <FilterDropdown {...props} values={getOptionValues(field.options)} />;
        }
        return <FilterDropdown {...props} values={getUniqueValues(memberRecords, field.id)} />;
      },
      render: (_: unknown, record: RecordWithCustomFields) => {
        // 데이터가 있는지 확인하고 없으면 기본값 제공
        const fieldValue = record[field.id] !== undefined ? record[field.id] : '';
        return renderFieldValue(fieldValue, field.type);
      },
    };
  };

  // 동적으로 컬럼 생성
  return useMemo<ColumnsType<RecordWithCustomFields>>(() => {
    // 정렬된 필드 ID 목록
    const orderedFieldIds = ['name', 'address', 'memo', 'joinDate', 'job', 'emailSubscription'];

    // 필드 ID를 기준으로 컬럼 생성
    const fieldColumns = orderedFieldIds
      .map(createFieldColumn)
      .filter((column): column is NonNullable<typeof column> => column !== null);

    // 정렬되지 않은 기타 필드들
    const otherFields = defaultFields.filter((field) => !orderedFieldIds.includes(field.id));
    const otherColumns = otherFields
      .map((field) => createFieldColumn(field.id))
      .filter((column): column is NonNullable<typeof column> => column !== null);

    // 액션 컬럼 추가
    const actionColumn = {
      key: 'actions',
      title: '액션',
      width: 50,
      render: (_: unknown, record: RecordWithCustomFields) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '수정',
                onClick: () => openEditModal(record as MemberRecord),
              },
              {
                key: 'delete',
                label: '삭제',
                danger: true,
                onClick: () => handleDelete(record as MemberRecord),
              },
            ],
            style: { minWidth: 180 },
          }}
          trigger={['click']}
        >
          <ActionButton type="text" icon={<MoreOutlined />} width={32} height={32} radius="0px" />
        </Dropdown>
      ),
    };

    return [...fieldColumns, ...otherColumns, actionColumn];
  }, [filteredInfo, openEditModal, handleDelete, memberRecords]);
};
