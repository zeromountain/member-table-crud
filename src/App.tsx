import React from 'react';

import { Layout } from 'antd';

import { FieldList } from './components/FieldManager/FieldList';

const App: React.FC = () => {
  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <FieldList />
    </Layout>
  );
};

export default App;
