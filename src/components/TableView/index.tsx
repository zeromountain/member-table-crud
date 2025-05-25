import { Layout } from 'antd';

import { MemberList } from './MemberList';
import ViewHeader from './ViewHeader';

const TableView = () => {
  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <ViewHeader />
      <MemberList />
    </Layout>
  );
};

export default TableView;
