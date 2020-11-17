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

### Upgrade steps
- [ ] [1. Update your dependencies](https://chakra-ui.com/docs/migration#1-update-your-dependencies)
- [ ] [2. Update the ThemeProvider](https://chakra-ui.com/docs/migration#2-update-the-themeprovider)
- [ ] [3. Rename variantColor to colorScheme](https://chakra-ui.com/docs/migration#3-rename-variantcolor-to-colorscheme)
- [ ] [4. Update layout size prop](https://chakra-ui.com/docs/migration#4-update-layout-size-prop)
- [ ] [5. Replace PseudoBox elements](https://chakra-ui.com/docs/migration#5-replace-pseudobox-elements)
- [ ] [6. Update theme breakpoints](https://chakra-ui.com/docs/migration#6-update-theme-breakpoints)
- [ ] [7. ColorModeScript (optional)](https://chakra-ui.com/docs/migration#7-colormodescript-optional)

### Components
- [ ] [Accordion](https://chakra-ui.com/docs/migration#accordion)
- [ ] [AspectRatioBox](https://chakra-ui.com/docs/migration#aspectratiobox)
- [ ] [Breadcrumb](https://chakra-ui.com/docs/migration#breadcrumb)
- [ ] [Button](https://chakra-ui.com/docs/migration#button)
- [ ] [Checkbox](https://chakra-ui.com/docs/migration#checkbox)
- [ ] [ColorMode](https://chakra-ui.com/docs/migration#colormode)
- [ ] [Editable](https://chakra-ui.com/docs/migration#editable)
- [ ] [Icons](https://chakra-ui.com/docs/migration#icons)
- [ ] [Icon Button](https://chakra-ui.com/docs/migration#icon-button)
- [ ] [Skeleton](https://chakra-ui.com/docs/migration#skeleton)
- [ ] [Image](https://chakra-ui.com/docs/migration#image)
- [ ] [Input](https://chakra-ui.com/docs/migration#input)
- [ ] [Link](https://chakra-ui.com/docs/migration#link)
- [ ] [Stack](https://chakra-ui.com/docs/migration#stack)
- [ ] [Menu](https://chakra-ui.com/docs/migration#menu)
- [ ] [Modal](https://chakra-ui.com/docs/migration#modal)
- [ ] [Progress](https://chakra-ui.com/docs/migration#progress)
- [ ] [CircularProgress](https://chakra-ui.com/docs/migration#circularprogress)
- [ ] [Radio](https://chakra-ui.com/docs/migration#radio)
- [ ] [RadioGroup](https://chakra-ui.com/docs/migration#radiogroup)
- [ ] [Slider](https://chakra-ui.com/docs/migration#slider)
- [ ] [Switch](https://chakra-ui.com/docs/migration#switch)
- [ ] [Tabs](https://chakra-ui.com/docs/migration#tabs)
- [ ] [Tags](https://chakra-ui.com/docs/migration#tags)
- [ ] [Toast](https://chakra-ui.com/docs/migration#toast)
- [ ] [Wrap (for `rc` versions)](https://chakra-ui.com/docs/migration#wrap-for-rc-versions)
- [ ] [Transition Components](https://chakra-ui.com/docs/migration#transition-components)
- [ ] [CSS Reset](https://chakra-ui.com/docs/migration#css-reset)
- [ ] [Hooks](https://chakra-ui.com/docs/migration#hooks)

Note: Some components can be grouped together eg. Progress and Switch share a common migration step, so we can group under "rename-color-to-colorscheme".

## Development

To watch and build TS files run:

```bash
yarn watch   
```

Link this package in your global `node_modules` by running:

```bash
yarn link
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
