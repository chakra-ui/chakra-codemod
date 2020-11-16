# Chakra UI Codemod

Chakra UI provides Codemod transformations to help upgrade your Chakra UI codebase when a component is updated or deprecated.

Codemods are transformations that run on your codebase programmatically. This allows for a large amount of changes to be applied without having to manually go through every file.

## Usage

```sh
npx @chakra-ui/codemod <transform> <path>
```

- `transform` - name of transform, see available transforms below.
- `path` - files or directory to transform
- `--dry` Do a dry-run, no code will be edited
- `--print` Prints the changed output for comparison

## Chakra V1 Codemods

// Martian's list goes here

## References

- https://skovy.dev/jscodeshift-custom-transform/
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code
- https://github.com/vutran/preact-codemod
- https://github.com/vercel/next.js/tree/canary/packages/next-codemod
