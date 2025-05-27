import type { Key } from 'react';

import { Checkbox, Tooltip, Typography } from 'antd';

import type { FieldOption, FieldType } from '@/types/field';
import type { RecordWithCustomFields } from '@/types/record';

const { Text } = Typography;

// 필드 타입별 글자 수 제한
const MAX_TEXT_LENGTH = 20;
const MAX_TEXTAREA_LENGTH = 50;

export const useMemberColumnsUtil = () => {
  // 옵션 배열을 문자열 배열로 변환하는 유틸리티 함수
  const getOptionValues = (options?: string[] | FieldOption[]): string[] => {
    if (!options) return [];
    if (options.length === 0) return [];

    // 문자열 배열인 경우
    if (typeof options[0] === 'string') {
      return options as string[];
    }

    // FieldOption 배열인 경우
    return (options as FieldOption[]).map((option) =>
      typeof option === 'string' ? option : option.value,
    );
  };

  // 유니크 값 목록 가져오기
  const getUniqueValues = (memberRecords: RecordWithCustomFields[], dataIndex: string) => {
    return Array.from(
      new Set(memberRecords.map((item: RecordWithCustomFields) => String(item[dataIndex] || ''))),
    );
  };

  // 필드 타입에 따른 렌더링 함수
  const renderFieldValue = (value: string | boolean | undefined, fieldType: FieldType) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }

    switch (fieldType) {
      case 'checkbox':
        return <Checkbox checked={!!value} />;
      case 'text':
        // 텍스트 필드는 최대 20자 표시
        if (typeof value === 'string' && value.length > MAX_TEXT_LENGTH) {
          return (
            <Tooltip title={value}>
              <Text ellipsis={{ tooltip: value }}>{value.substring(0, MAX_TEXT_LENGTH)}...</Text>
            </Tooltip>
          );
        }
        return value;
      case 'textarea':
        // 텍스트영역 필드는 최대 50자 표시, 내용이 길면 툴팁 표시
        if (typeof value === 'string' && value.length > MAX_TEXTAREA_LENGTH) {
          return (
            <Tooltip title={value}>
              <Text ellipsis={{ tooltip: value }}>
                {value.substring(0, MAX_TEXTAREA_LENGTH)}...
              </Text>
            </Tooltip>
          );
        }
        return value;
      default:
        return value;
    }
  };

  // 필드 타입에 따른 필터링 함수
  const filterField = (
    value: boolean | Key,
    record: RecordWithCustomFields,
    fieldId: string,
    fieldType: FieldType,
  ) => {
    const recordValue = record[fieldId];
    const valueStr = String(value);

    switch (fieldType) {
      case 'checkbox':
        if (valueStr === '선택됨') return !!recordValue === true;
        if (valueStr === '선택 안함') return !!recordValue === false;
        return false;
      case 'text':
      case 'textarea':
        return recordValue?.toString().includes(valueStr) || false;
      case 'date':
      case 'select':
      default:
        return String(recordValue) === valueStr;
    }
  };

  // 컬럼 타이틀 렌더링 함수 - 필수 필드 표시 및 툴팁 추가
  const renderColumnTitle = (field: { label: string; required: boolean; type: FieldType }) => {
    return <div style={{ display: 'flex', alignItems: 'center' }}>{field.label}</div>;
  };

  return {
    getOptionValues,
    getUniqueValues,
    renderFieldValue,
    filterField,
    renderColumnTitle,
  };
};
