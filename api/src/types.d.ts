// Import Vitest types explicitly for better type inference
import type { 
  Mocked, 
  MockInstance, 
  SpyInstance, 
  Mock, 
  MockedFunction, 
  MockedObject 
} from 'vitest';

// Declare global variables for Vitest to mimic Jest's global variables
declare global {
  namespace Vi {
    // Export all types from vitest
    export type { 
      Mocked, 
      MockInstance, 
      SpyInstance, 
      Mock, 
      MockedFunction, 
      MockedObject 
    };
  }

  // Add global jest-like functions for compatibility
  const vi: typeof import('vitest')['vi'];
  const expect: typeof import('vitest')['expect'];
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterEach: typeof import('vitest')['afterEach'];
  const beforeAll: typeof import('vitest')['beforeAll'];
  const afterAll: typeof import('vitest')['afterAll'];
} 