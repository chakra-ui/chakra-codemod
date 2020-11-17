declare module "is-git-clean" {
  function isGitClean(dir?: string, options?: {files: string[]}): Promise<boolean>
  export default isGitClean
}
