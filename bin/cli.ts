import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import globby from "globby";
import hasYarn from "has-yarn";
import inquirer from "inquirer";
import isGitClean from "is-git-clean";
import meow, { Result as MeowResult } from "meow";
import path from "path";
import pkgUp from "pkg-up";
import pkgDir from "pkg-dir";
import { promisify } from "util";
import editJsonFile from "edit-json-file";

const readDirAsync = promisify(fs.readdir);
const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");
const transformerDirectory = path.join(__dirname, "..", "transforms");

function expandFilePathsIfNeeded(files: string[]) {
  const shouldExpandFiles = files.some((file) => file.includes("*"));
  return shouldExpandFiles ? globby.sync(files) : files;
}

const log = {
  info: (...text) => console.log(chalk.blue("[chakra-codemod]:", ...text)),
  warn: (...text) => console.log(chalk.yellow("[chakra-codemod]:", ...text)),
  error: (...text) => console.log(chalk.red("[chakra-codemod]:", ...text)),
  success: (...text) =>
    console.log(chalk.bgGreen("[chakra-codemod]:", ...text)),
};

async function updateDependencies() {
  log.info(`Detecting project root...`);
  const root = await pkgDir();

  log.info(`Detecting package runner (npm or yarn)...`);
  const isYarn = hasYarn(root);

  const pkgJsonPath = await pkgUp();
  const json = editJsonFile(pkgJsonPath, { autosave: true });

  const pkgs = [
    "@chakra-ui/core",
    "@emotion/core",
    "@emotion/styled",
    "emotion-theming",
  ];

  log.info(`Removing old dependencies...`);
  pkgs.forEach((pkg) => {
    json.unset(`dependencies.${pkg}`);
  });

  const newPkgs = [
    "@chakra-ui/react",
    "@chakra-ui/icons",
    "@chakra-ui/theme-tools",
    "@emotion/react",
    "@emotion/styled",
    "framer-motion",
  ];

  log.info(`Adding new dependencies...`);
  newPkgs.forEach((pkg) => {
    const { stdout: version } = execa.commandSync(`npm view ${pkg} version`);
    json.set(`dependencies.${pkg}`, version);
  });

  log.info(`Installing...`);
  execa.commandSync(isYarn ? "yarn" : "npm i");
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
      log.warn(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else if (isForceEnvSet) {
      log.info(`CHAKRA_CODEMOD_FORCE_GIT is set - continuing...`);
    } else {
      log.success("Thank you for using @chakra-ui/codemod!");
      log.warn(
        "\nBut before we continue, please stash or commit your git changes.",
      );
      log.info("\nYou may use the --force flag to override this safety check.");
      process.exit(1);
    }
  }
}

async function getCodeModNames() {
  const files = await readDirAsync(transformerDirectory);
  return files
    .filter((file) => file.endsWith(".js"))
    .map((file) => path.basename(file, ".js"));
}

async function askQuestions(cli: MeowResult<{}>) {
  let codemods = await getCodeModNames();
  codemods = codemods.filter((name) => name !== "core-to-react");

  const [selectedPath, selectedCodemods] = cli.input;

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
      type: "checkbox",
      name: "codemods",
      message: "Which codemod(s) would like to apply?",
      when: !selectedCodemods,
      default: selectedCodemods,
      pageSize: codemods.length,
      choices: codemods,
    },
  ]);
}

interface RunTransformOptions {
  files: string[];
  flags?: any;
  codemod: any;
}

export function runTransform(options: RunTransformOptions) {
  const { files, flags = {}, codemod } = options;
  const transformerPath = path.join(transformerDirectory, `${codemod}.js`);

  let args = [];

  const { dry, print } = flags;

  if (dry) args.push("--dry");
  if (print) args.push("--print");

  args.push("--verbose=2");

  args.push("--ignore-pattern=**/node_modules/**");
  args.push("--ignore-pattern=**/.next/**");

  args.push("--extensions=tsx,ts,jsx,js");
  args.push("--parser=tsx");

  args = args.concat(["--transform", transformerPath]);

  args = args.concat(files);

  log.info(`Executing command: jscodeshift ${args.join(" ")}`);

  const result = execa.sync(jscodeshiftExecutable, args);

  if (result.failed) {
    throw result.stderr;
  }
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

  await updateDependencies();

  const answer = await askQuestions(cli);

  const filesBeforeExpansion = cli.input[1] || answer.files;
  const files = expandFilePathsIfNeeded([filesBeforeExpansion]);
  const codemods = cli.input[0] || answer.codemods;

  if (!files.length) {
    log.error(`No files found matching ${files.join(" ")}`);
    return null;
  }

  // It's important to run this last after all transformations are done
  codemods.push("core-to-react");

  for (const codemod of codemods) {
    runTransform({
      files,
      codemod,
      flags: cli.flags,
    });
  }
}
