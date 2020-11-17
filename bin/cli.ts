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

async function askQuestions(options: { codemods: string[] }) {
  const allText = "ALL";
  const answers: {
    mods: string[];
    isDryRun: boolean;
  } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "mods",
      message: "Which code mods do you want to run?",
      choices: [allText, ...options.codemods],
      default: [allText],
    },
    {
      type: "confirm",
      name: "isDryRun",
      message: "Do you want to perform a dry run?",
      default: true,
    },
  ]);

  if (answers.mods.includes(allText)) {
    // if "ALL" are selected, return every available codemod
    return {
      ...answers,
      mods: options.codemods.slice(),
    };
  }

  return answers;
}

export async function bootstrap() {
  const workingDir = getWorkingDir();
  console.log(`${chalk.blue`Run chakra codemod in: `}${chalk(workingDir)}`);

  const isWorkingDirClean = await isWorkdirClean(workingDir);
  if (!isWorkingDirClean) {
    console.log(
      chalk.yellow`There are uncommited changes in your working directory.
Please commit or stash them before running the codemode.`,
    );
  }

  // TODO get real codemod names
  const codemods = ["these", "are", "the", "names", "of", "our", "codemods"];
  const answers = await askQuestions({ codemods });

  // TODO run it 💨
  console.log(answers);
}

bootstrap().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
