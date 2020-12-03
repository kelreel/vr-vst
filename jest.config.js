module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  rootDir: "./src",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  coverageReporters: ["json", "lcov", "text", "clover"], // "text-summary"
};
