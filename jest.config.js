/**
 * Jest Configuration for AuraGlass Component Library
 * Week 5: Testing & Validation Setup - Enhanced
 */

module.exports = {
  // Use jsdom for browser-like environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/utils/testSetup.ts'
  ],

  // Module paths
  moduleNameMapper: {
    // Path aliases from tsconfig
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/animations/(.*)$': '<rootDir>/src/animations/$1',
    '^@/primitives/(.*)$': '<rootDir>/src/primitives/$1',
    '^@/theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',

    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Handle image imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{spec,test}.{ts,tsx}'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/docs/',
    '/examples/',
    '/test-results/',
    '/playwright-report/',
    'visual', // Separate visual tests
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/utils/testingUtils.tsx',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/index.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: '<rootDir>/coverage',

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Globals
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },

  // Verbose output
  verbose: true,

  // Max workers for parallel execution
  maxWorkers: '50%',

  // Test timeout
  testTimeout: 10000,
};
