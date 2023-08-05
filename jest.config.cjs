module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  preset: "ts-jest/presets/default-esm",
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns : [
    'd.ts' 
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      statements: 25,
      branches: 25,
      functions: 25,
      lines: 25,
    },
  },
};