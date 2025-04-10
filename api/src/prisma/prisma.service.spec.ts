import { PrismaService } from "./prisma.service";
import { describe, it, expect, vi } from "vitest";

// Mock the PrismaClient to avoid actual database connections
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: class MockPrismaClient {
      $connect = vi.fn();
      $disconnect = vi.fn();
    },
  };
});

describe("PrismaService", () => {
  it("should be defined", () => {
    const service = new PrismaService();
    expect(service).toBeDefined();
  });

  it("should have onModuleInit method", () => {
    const service = new PrismaService();
    expect(service.onModuleInit).toBeDefined();
    expect(typeof service.onModuleInit).toBe("function");
  });

  it("should have onModuleDestroy method", () => {
    const service = new PrismaService();
    expect(service.onModuleDestroy).toBeDefined();
    expect(typeof service.onModuleDestroy).toBe("function");
  });
});
