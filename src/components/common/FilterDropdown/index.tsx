import { Checkbox } from 'antd';

import type { FilterDropdownProps } from 'antd/es/table/interface';

import { Container, FilterItem, FilterList, Label } from './styles';

interface CustomFilterDropdownProps extends FilterDropdownProps {
  values: string[];
}

export const FilterDropdown = ({
  setSelectedKeys,
  selectedKeys,
  values,
  confirm,
}: CustomFilterDropdownProps) => {
  const handleCheckboxChange = (value: string) => {
    const newSelectedKeys = selectedKeys.includes(value)
      ? selectedKeys.filter((key) => key !== value)
      : [...selectedKeys, value];
    setSelectedKeys(newSelectedKeys);
    confirm();
  };

  return (
    <Container>
      <FilterList>
        {values.map((value) => (
          <FilterItem key={value} onClick={() => handleCheckboxChange(value)}>
            <Checkbox
              checked={selectedKeys.includes(value)}
              onChange={() => handleCheckboxChange(value)}
            />
            <Label>{value}</Label>
          </FilterItem>
        ))}
      </FilterList>
    </Container>
  );
};
