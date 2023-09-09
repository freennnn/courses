// const { defaultsESM: tsjPreset } = require('ts-jest/presets')
// console.log(tsjPreset);
// {
//   extensionsToTreatAsEsm: [ '.ts', '.tsx', '.mts' ],
//   transform: { '^.+\\.tsx?$': [ 'ts-jest', { useESM: true } ] }
// }

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
  // preset: "ts-jest/presets/default-esm",
  transform: {
    // ...tsjPreset.transform,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343]
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta',  // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
              options: { metaObjectReplacement: { env: { VITE_CTP_PROJECT_KEY: 'MyProject', VITE_CTP_CLIENT_ID: 'MyClient', VITE_CTP_CLIENT_SECRET: 'MyClientSecret'}} }
            }
          ]
        },
        useESM: true,
      }
    ]
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns : [
    'd.ts' 
  ],
  moduleNameMapper: {
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '\\.scss$': '<rootDir>/src/__tests__/empty-module.ts',
  },
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