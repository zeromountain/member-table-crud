import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 8px;
  background-color: white;
  border-radius: 6px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

export const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
`;

export const FilterItem = styled.li`
  padding: 5px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const Label = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
`;
