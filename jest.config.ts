import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      // to process js/ts with `ts-jest`
      'ts-jest',
      {
        tsconfig: {
          target: 'ESNext',
          lib: ['DOM', 'ESNext'],
          skipLibCheck: true,
          strictPropertyInitialization: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
          isolatedModules: true,
        },
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
