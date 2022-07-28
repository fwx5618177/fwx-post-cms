export default {
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
        URL: 'http://localhost:5173/',
        // window: {
        //     location: {},
        //     document: {},
        // },
    },
    preset: 'ts-jest',
    // preset: "jest-puppeteer",
    globalSetup: './test/setup.ts',
    globalTeardown: './test/teardown.ts',
    testEnvironment: './test/puppeteer_environment.ts',
    // testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx.?$': 'ts-jest',
        '^.+\\.svg$': 'jest-transform-stub',
        '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testPathIgnorePatterns: ['/node_modules/', 'src/types'],
    moduleDirectories: ['node_modules'],
    testRegex: '.*\\.test\\.(js|ts).?$',
    testTimeout: 20000,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', 'test/**/*.test.ts', '!**/node_modules/**', '!src/*.d.ts'],
    moduleNameMapper: {
        // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
        // '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
        // '^react$': 'preact-compat',
        '^assets/(.*)$': ['<rootDir>/assets/$1'],
        '^src/(.*)$': '<rootDir>/src/$1',
        '^.+.(svg|png|jpg)$': 'jest-transform-stub',
        '^react-dom$': 'preact-compat',
    },
    // setupFilesAfterEnv: ['<rootDir>/test/enzyme.ts'],
    // coverageThreshold: {
    //   global: {
    //     branches: 80,
    //     functions: 80,
    //     lines: 80,
    //     statements: -10,
    //   },
    //   "./src/**/*.tsx": {
    //     branches: 40,
    //     statements: 40,
    //   },
    // },
    snapshotFormat: {
        printBasicPrototype: false,
    },
    snapshotResolver: '<rootDir>/snapshot.ts',
}
