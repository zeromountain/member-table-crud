import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import 'antd/dist/reset.css';

import '@ant-design/v5-patch-for-react-19';

import { FieldManagerProvider } from '@contexts/FieldManager.tsx';
import { MemberModalProvider } from '@contexts/MemberModalContext.tsx';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FieldManagerProvider>
      <MemberModalProvider>
        <App />
      </MemberModalProvider>
    </FieldManagerProvider>
  </StrictMode>,
);
