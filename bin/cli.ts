#!/usr/bin/env node

import fs from "fs";
import chalk from "chalk";
import path from "path";
import isGitClean from "is-git-clean";
import inquirer from "inquirer";

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

async function isWorkdirClean(workingDir: string) {
  try {
    return await isGitClean(workingDir);
  } catch {
    // workdir is not a git repo
    return true;
  }
}

async function checkWorkDir(workingDir: string) {
  const isWorkingDirClean = await isWorkdirClean(workingDir);
  if (!isWorkingDirClean) {
    console.log(
      chalk.yellow`There are uncommitted changes in your working directory.
Please commit or stash them before running the code mod.`,
    );

    if (!process.env.CHAKRA_CODEMOD_FORCE_GIT) {
      process.exit(1);
    }

    console.log(chalk.blue`CHAKRA_CODEMOD_FORCE_GIT is set - continuing...`);
  }
}

async function askQuestions(options: { codemods: string[] }) {
  const answers: {
    codemods: string[];
    dry: boolean;
    print: boolean;
  } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "codemods",
      message: "Which code mods do you want to run?",
      choices: options.codemods,
      default: options.codemods,
    },
    {
      type: "confirm",
      name: "dry",
      message: "Do you want to perform a dry run?",
      default: true,
    },
    {
      type: "confirm",
      name: "print",
      message: "Print all modified files?",
      default: true,
    },
  ]);

  return answers;
}

export async function bootstrap() {
  const workingDir = getWorkingDir();
  console.log(`${chalk.blue`Run chakra codemod in: `}${chalk(workingDir)}`);

  await checkWorkDir(workingDir);

  // TODO get real codemod names
  const codemods = ["these", "are", "the", "names", "of", "our", "code mods"];
  const answers = await askQuestions({ codemods });

  // TODO run it 💨
  console.log(answers);
}

bootstrap().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
