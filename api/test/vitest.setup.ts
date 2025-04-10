import { vi, expect } from "vitest";

// Make Vitest APIs globally available
// This is similar to how Jest works
global.vi = vi;
global.expect = expect;

// Mock NestJS auth-related modules
vi.mock("@nestjs/passport", () => {
  return {
    AuthGuard: (strategy) => {
      return class MockAuthGuard {
        canActivate() {
          return true;
        }
      };
    },
    PassportStrategy: (Strategy) => {
      return class extends Strategy {};
    },
    PassportModule: {
      register: () => ({
        module: class MockPassportModule {},
        providers: [],
        exports: [],
      }),
    },
  };
});

// Mock the passport-http-bearer module
vi.mock("passport-http-bearer", () => {
  return {
    Strategy: class MockStrategy {
      constructor(verify) {
        this.name = "bearer";
        this.verify = verify;
      }
    },
  };
});

// Mock JwtModule
vi.mock("@nestjs/jwt", () => {
  return {
    JwtModule: {
      registerAsync: () => ({
        module: class MockJwtModule {},
        providers: [],
        exports: [],
      }),
    },
    JwtService: class MockJwtService {
      sign() {
        return "mock-jwt-token";
      }
      verify() {
        return { sub: "test-wallet" };
      }
    },
  };
});

// Mock ConfigModule
vi.mock("@nestjs/config", () => {
  return {
    ConfigModule: {
      forRoot: () => ({
        module: class MockConfigModule {},
        providers: [],
        exports: [],
      }),
    },
    ConfigService: class MockConfigService {
      get(key) {
        const config = {
          JWT_SECRET: "test-secret",
          DATABASE_URL: "test-db-url",
        };
        return config[key];
      }
    },
  };
});
