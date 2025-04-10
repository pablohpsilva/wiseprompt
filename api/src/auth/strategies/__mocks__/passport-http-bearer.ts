// Mock implementation of passport-http-bearer
import { vi } from "vitest";

export class Strategy {
  name: string;
  verify: Function;

  constructor(options: any, verify?: Function) {
    if (typeof options === "function") {
      verify = options;
    }

    this.name = "bearer";
    this.verify = verify || (() => {});
  }

  authenticate(req: any, options?: any) {
    // Mock authentication functionality
    vi.fn();
  }
}

// Export a default object to match module.exports
export default { Strategy };
