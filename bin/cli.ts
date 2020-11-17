#!/usr/bin/env node

import fs from "fs";
import chalk from "chalk";
import path from "path";

function getWorkingDir() {
  const workingDir = path.resolve(process.argv[2] || process.cwd());

  if (!workingDir || !fs.existsSync(workingDir)) {
    console.log(
      chalk.yellow`Invalid working dir: ${workingDir}. Please pass a valid path`,
    );
    process.exit(1);
  }

  return workingDir;
}

export async function bootstrap() {
  const workingDir = getWorkingDir();
  console.log(`${chalk.blue`Run chakra codemod in: `}${chalk(workingDir)}`);
}

bootstrap().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
