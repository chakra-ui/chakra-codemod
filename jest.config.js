module.exports = {
  roots: ["<rootDir>/transforms"],
  moduleNameMapper: {
    "^utils/(.*)$": "<rootDir>/utils/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
