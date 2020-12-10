import chalk from "chalk";

export const info = (...text: string[]) =>
  console.log(chalk.blue("[chakra-codemod]:", ...text));
export const warn = (...text: string[]) =>
  console.log(chalk.yellow("[chakra-codemod]:", ...text));
export const error = (...text: string[]) =>
  console.log(chalk.red("[chakra-codemod]:", ...text));
export const success = (...text: string[]) =>
  console.log(chalk.bgGreen("[chakra-codemod]:", ...text));
