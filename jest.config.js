module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/src/setup.jest.ts'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/app/pages/',
    '<rootDir>/src/app/shared/components/',
    '<rootDir>/src/app/shared/interfaces/',
    '<rootDir>/src/app/shared/material/',
    '<rootDir>/src/app/shared/pages/',
    '<rootDir>/src/app/shared/pipes/',
    '<rootDir>/src/app/app.component.spec.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        diagnostics: false,
        useESM: true
      }
    ]
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  roots: [
    '<rootDir>/src'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|jest-preset-angular|ngrx|deck.gl|ng-dynamic))'
  ],
  extensionsToTreatAsEsm: [
    '.ts',
    '.tsx'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '.*\\.functional\\.spec\\.ts'
  ]
};
