import { useState } from 'react';

import { Layout } from 'antd';

import { MemberList } from './MemberList';
import ViewHeader from './ViewHeader';

const TableView = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <ViewHeader selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
      <MemberList selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
    </Layout>
  );
};

export default TableView;
