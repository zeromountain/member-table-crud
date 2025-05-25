import { afterEach, expect } from 'vitest';

import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// RTL matchers 확장
expect.extend(matchers);

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});
