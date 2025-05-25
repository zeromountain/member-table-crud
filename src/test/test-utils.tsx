import type { ReactElement } from "react";
import {
  render as rtlRender,
  type RenderOptions,
  screen,
  within,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { ...options }),
  };
};

export { customRender as render, screen, within, fireEvent };
export { userEvent };
