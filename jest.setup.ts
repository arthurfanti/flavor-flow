import './jest.polyfill.tsx'
import '@testing-library/jest-dom'

// TypeScript declarations for Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

// Mock fetch for Node.js environment
global.fetch = global.fetch || jest.fn();

// Extend Jest matchers
export {};