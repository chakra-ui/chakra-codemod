# Contribution Guide

- Clone or fork the project
- Run `yarn` to install all dependencies

## Writing a Codemod

I recommend reading these blog posts to give you a clear idea of what codemods are and how to get started:

- https://skovy.dev/jscodeshift-custom-transform/
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code

- Add your codemod transform functions in the `transforms/` directory
- Add fixtures in the `__testfixtures__` directory to test the input and output scenarios. Ensure the file name for your transform function matches the folder name in the `__testfixtures__` directory
- To write tests, follow the structure in `__test__` directory to make your own test.

Then run `yarn test`
