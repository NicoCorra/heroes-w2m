# Data Base

https://www.npmjs.com/package/json-server

Install

npm install json-server

Run

npx json-server --watch data/db.json

# SuperHeroes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Install JEST unit tests

Install JEST en angular 18 

`Paso 1`: quitar karma y jasmine

          npm uninstall karma \
            karma-chrome-launcher \
            karma-coverage \
            karma-jasmine \
            karma-jasmine-html-reporter

          rm ./karma.conf.js ./src/test.ts

`Paso 2` instalar Jest y librerias a utilizar

          npm i testing-library @testing-library/angular 
                  @testing-library/dom @testing-library/jest-dom 
                  @testing-library/user-event --save-dev

          npm i @types/testing-library__jest-dom

          npm i @playwright/test @playwright-ng-schematics

          npm install jest \
            @types/jest \
            @jest/globals \ 
            jest-preset-angular \ 
            --save-dev

`Paso 3`: configurar el tsconfig.spec.json

    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": true,
        "isolatedModules": true,
        "strict": true,
        "outDir": "./out-tsc/spec",
        "types": ["jest",
          "@testing-library/jest-dom"
        ]
      },
      "include": [
        "src/**/*.spec.ts",
        "src/**/*.d.ts"
      ]
    }

`Paso 4`: Crear archico a nivel src/setup.jest.ts y agregar el siguiente código

    import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
    setupZoneTestEnv();
    import "@testing-library/jest-dom"

`Paso 5`: crear archivo a nivel de raíz jest.config.js y agregar el siguiente código

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/src/setup.jest.ts'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/app/auth/',
    '<rootDir>/src/app/components/',
    '<rootDir>/src/app/directivas/',
    '<rootDir>/src/app/heroes/',
    '<rootDir>/src/app/interfaces/',
    '<rootDir>/src/app/material/',
    '<rootDir>/src/app/pipes/',
    '<rootDir>/src/app/shared/',
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

## Running unit tests
  npm run test

  npm run test:wath

  npm run test:coverage

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
