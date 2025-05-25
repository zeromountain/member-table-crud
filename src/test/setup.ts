import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

// RTL matchers 확장
expect.extend(matchers);

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});
