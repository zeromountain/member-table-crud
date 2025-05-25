import type { ReactElement } from 'react';

import {
  type RenderOptions,
  fireEvent,
  render as rtlRender,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { ...options }),
  };
};

export { customRender as render, screen, within, fireEvent };
export { userEvent };
