# Chakra UI Codemod

Chakra UI provides Codemod transformations to help upgrade your Chakra UI codebase when a component is updated or deprecated.

Codemods are transformations that run on your codebase programmatically. This allows for a large amount of changes to be applied without having to manually go through every file.

## Usage

If you're using a monorepo, you'll need to `cd` into the specific package that has Chakra UI installed. Otherwise, you can run these at the root of your project.

```sh
npx @chakra-ui/codemod [path]
```

The codemod will ask you a few questions:

- Which files or directory should the codemods be applied? [text]
- Which codemod(s) would like to apply? [select]

### Flags

- `--dry`: Pass if you want to perform a dry run?
- `--print`: Pass if you want to print the modified files

> If you are running this command in a git repository, please commit or stash your changes first

## Chakra V1 Codemods

### Status

- [x] Update `color` to `colorScheme`
- [x] Update import from `@chakra-ui/core` to `@chakra-ui/react`
- [ ] Rename `size` prop for `Box` or `PseudoBox` to `w` and `h`
- [x] Update `Slider` JSX structure
- [x] Rename `ThemeProvider` to `ChakraProvider`
- [x] Update component Imports to reflect updates
- [x] Update `useDisclosure` signature
- [x] Change `v0` Icons to `v1` Icons
- [x] Replace string icon prop to `Button` and `IconButton` to icon elements from `@chakra-ui/icons`

## Development

To watch and build TS files run:

```bash
yarn watch
```

Link this package in your global `node_modules` by running:

```bash
npm link
```

To execute the command run:

```bash
# no path
chakra-codemod
> Run chakra codemod in: <current-directory>

# relative path
chakra-codemod my-app
> Run chakra codemod in: <current-directory>/my-app

# absolute path
chakra-codemod /Users/you/development/my-app
> Run chakra codemod in: /Users/you/development/my-app
```

## References

- https://skovy.dev/jscodeshift-custom-transform/
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code
- https://github.com/vutran/preact-codemod
- https://github.com/vercel/next.js/tree/canary/packages/next-codemod

## Todo

Write transforms for:

- `RadioGroup` and `CheckboxGroup` JSX update.
- Skeleton update (https://chakra-ui.com/docs/migration#radiogroup)
- Rename `ListProps` from `stylePos` to `stylePosition`
- Update CircularProgress `thickness` calculation (https://chakra-ui.com/docs/migration#circularprogress)
- Update Skeleton props (https://chakra-ui.com/docs/migration#skeleton)
