import fs from "fs";
import chalk from "chalk";
import path from "path";
import isGitClean from "is-git-clean";
import inquirer from "inquirer";
import { promisify } from "util";
import meow, { Result as MeowResult } from "meow";
import execa from "execa";

const readDirAsync = promisify(fs.readdir);
const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");

function checkPathExist(path?: string) {
  if (!path || !fs.existsSync(path)) {
    console.log(
      chalk.yellow`Invalid working dir: ${path}. Please pass a valid path`,
    );
    process.exit(1);
  }
}

export async function checkGitStatus(options: { dir: string; force: boolean }) {
  const { dir, force } = options;

  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";

  const isForceEnvSet = process.env.CHAKRA_CODEMOD_FORCE_GIT;

  try {
    clean = await isGitClean(dir);
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err?.stderr?.indexOf("Not a git repository") >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else if (isForceEnvSet) {
      console.log(chalk.blue`CHAKRA_CODEMOD_FORCE_GIT is set - continuing...`);
    } else {
      console.log("Thank you for using @chakra-ui/codemod!");
      console.log(
        chalk.yellow(
          "\nBut before we continue, please stash or commit your git changes.",
        ),
      );
      console.log(
        "\nYou may use the --force flag to override this safety check.",
      );
      process.exit(1);
    }
  }
}

const transformerDirectory = path.join(__dirname, "..", "transforms");

async function getCodeModNames() {
  const files = await readDirAsync(transformerDirectory);
  return files
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.basename(file, ".js"));
}

async function askQuestions(cli: MeowResult<{}>) {
  const codemods = await getCodeModNames();
  const [selectedPath, selectedTransforms] = cli.input;

  return await inquirer.prompt([
    {
      type: "input",
      name: "files",
      message: "On which files or directory should the codemods be applied?",
      when: !selectedPath,
      default: selectedPath,
      filter: (files) => files.trim(),
    },
    {
      type: "list",
      name: "transformer",
      message: "Which codemod(s) would like to apply?",
      when: !selectedTransforms,
      default: selectedTransforms,
      pageSize: codemods.length,
      choices: codemods,
    },
  ]);
}

export function runTransform({ files, flags, transformer }) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`);

  let args = [];

  const { dry, print } = flags;

  if (dry) {
    args.push("--dry");
  }
  if (print) {
    args.push("--print");
  }

  args.push("--verbose=2");

  args.push("--ignore-pattern=**/node_modules/**");
  args.push("--ignore-pattern=**/.next/**");

  args.push("--extensions=tsx,ts,jsx,js");
  args.push("--parser=tsx");

  args = args.concat(["--transform", transformerPath]);

  args = args.concat(files);

  console.log(chalk.green`Executing command: jscodeshift ${args.join(" ")}`);

  console.log(jscodeshiftExecutable);

  // const result = execa.sync(jscodeshiftExecutable, args);

  // if (result.failed) {
  //   throw result.stderr;
  // }
}

export async function run() {
  const cli = meow({
    description: "Codemods for updating Chakra UI apps.",
    help: `
    Usage
      $ npx @chakra-ui/codemod <transform> <path> <...options>
        transform    One of the choices from https://github.com/chakra-ui/chakra-codemod/tree/main/transforms
        path         Files or directory to transform. Can be a glob like pages/**.js
    Options
      --force            Bypass Git safety checks and forcibly run codemods
      --dry              Dry run (no changes are made to files)
      --print            Print transformed files to your terminal
    `,
    flags: {
      force: { type: "boolean", alias: "f" },
      dry: { type: "boolean", alias: "t" },
      print: { type: "boolean", alias: "p" },
    },
  });

  if (!cli.flags.dry) {
    await checkGitStatus({
      dir: cli.input[0] || process.cwd(),
      force: cli.flags.force,
    });
  }

  const { files, transformer } = await askQuestions(cli);

  const filesExpanded = cli.input[1] || files;
  const selectedTransformer = cli.input[0] || transformer;

  if (!filesExpanded.length) {
    console.log(`No files found matching ${filesExpanded.join(" ")}`);
    return null;
  }

  return runTransform({
    files: filesExpanded,
    transformer: selectedTransformer,
    flags: cli.flags,
  });
}
