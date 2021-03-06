import {
  Collection,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
} from "jscodeshift";

interface HasSubmoduleOptions {
  moduleName: string;
  submoduleName: string;
}

/**
 * Checks if an import statement contains specific module import
 *
 * @example
 *
 * import { Box } from "@chakra-ui/core"
 *
 * const result = hasSubmoduleImport(j, root, {
 *   moduleName: "@chakra-ui/core",
 *   submoduleName: "Box"
 * })
 *
 * result // => True
 */
export function hasSubmoduleImport(
  j: JSCodeshift,
  root: Collection,
  options: HasSubmoduleOptions,
) {
  const { moduleName, submoduleName } = options;

  return (
    root
      .find(j.ImportDeclaration, {
        source: { value: moduleName },
      })
      .find(j.ImportSpecifier, {
        imported: { name: submoduleName },
      }).length > 0
  );
}

function hasModuleImport(j: JSCodeshift, root: Collection, moduleName: string) {
  return (
    root.find(j.ImportDeclaration, {
      source: { value: moduleName },
    }).length > 0
  );
}

interface AddModuleImportOptions {
  pkgName: string;
  importSpecifier: ImportSpecifier;
}

export function addModuleImport(
  j: JSCodeshift,
  root: Collection,
  options: AddModuleImportOptions,
) {
  const { pkgName, importSpecifier } = options;
  /**
   * - if has module imported, just import new submodule from existed
   * - else, create a new import
   */
  if (hasModuleImport(j, root, pkgName)) {
    root
      .find(j.ImportDeclaration, {
        source: { value: pkgName },
      })
      .at(0)
      .replaceWith(({ node }) => {
        const mergedImportSpecifiers = node.specifiers
          .concat(importSpecifier)
          .sort((a, b) => {
            if (a.type === "ImportDefaultSpecifier") {
              return -1;
            }

            if (b.type === "ImportDefaultSpecifier") {
              return 1;
            }

            if (
              a.type === "ImportNamespaceSpecifier" ||
              b.type === "ImportNamespaceSpecifier"
            ) {
              return -1;
            }

            return a.imported.name.localeCompare(b.imported.name);
          });
        return j.importDeclaration(mergedImportSpecifiers, j.literal(pkgName));
      });
    return true;
  }
}

interface AddSubmoduleImportOptions {
  moduleName: string;
  importedName: string;
  localName?: string;
}

/**
 * Add module to a package if the package exists
 */
export function addSubmoduleImport(
  j: JSCodeshift,
  root: Collection,
  options: AddSubmoduleImportOptions,
) {
  const { moduleName, importedName, localName } = options;
  if (hasSubmoduleImport(j, root, { moduleName, submoduleName: localName })) {
    return;
  }

  const importSpecifier = j.importSpecifier(
    j.identifier(importedName),
    localName ? j.identifier(localName) : null,
  );

  if (addModuleImport(j, root, { pkgName: moduleName, importSpecifier })) {
    return;
  }

  throw new Error(`No ${moduleName} import found!`);
}

interface InsertImportAfterOptions {
  importStatement: ImportDeclaration;
  afterModule: string;
}

export function insertImportAfter(
  j: JSCodeshift,
  root: Collection,
  options: InsertImportAfterOptions,
) {
  const { importStatement, afterModule } = options;

  const firstImport = root
    .find(j.ImportDeclaration, {
      source: { value: afterModule },
    })
    .at(0);

  if (firstImport.paths()[0]) {
    firstImport.insertAfter(importStatement);
  } else {
    root.get().node.program.body.unshift(importStatement);
  }
}

interface InsertImportBeforeOptions {
  importStatement: ImportDeclaration;
  beforeModule: string;
}

export function insertImportBefore(
  j: JSCodeshift,
  root: Collection,
  options: InsertImportBeforeOptions,
) {
  const { importStatement, beforeModule } = options;
  const firstBeforeModuleImport = root
    .find(j.ImportDeclaration, {
      source: { value: beforeModule },
    })
    .at(0);

  const firstNode = root.find(j.Program).get("body", 0).node;

  if (
    (firstBeforeModuleImport.paths()[0] &&
      firstBeforeModuleImport.paths()[0].node === firstNode) ||
    !firstBeforeModuleImport
  ) {
    // https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
    const { comments } = firstNode;
    if (comments) {
      delete firstNode.comments;
      importStatement.comments = comments;
    }
  }

  if (firstBeforeModuleImport) {
    firstBeforeModuleImport.insertBefore(importStatement);
  } else {
    // insert `import` at body(0)
    root.get().node.program.body.unshift(importStatement);
  }
}

interface RemoveModuleImportOptions {
  moduleName: string;
  selector: string;
}

export function removeModuleImport(
  j: JSCodeshift,
  root: Collection,
  options: RemoveModuleImportOptions,
) {
  const { moduleName, selector } = options;

  root
    .find(j.ImportDeclaration, {
      source: {
        value: moduleName,
      },
    })
    .find(j.ImportSpecifier)
    .filter((path) => {
      const regex = new RegExp(`^(${selector})$`);
      return regex.test(path.node.imported.name);
    })
    .remove();
}

export function insertOrCreateSubmoduleImport(
  j: JSCodeshift,
  root: Collection,
  options: { moduleName: string; importedName: string },
) {
  const { moduleName, importedName } = options;

  const exists =
    root
      .find(j.ImportDeclaration, {
        source: { value: moduleName },
      })
      .paths().length >= 1;

  if (exists) {
    addSubmoduleImport(j, root, {
      importedName,
      moduleName,
    });
  } else {
    insertImportAfter(j, root, {
      afterModule: "@chakra-ui/core",
      importStatement: j.importDeclaration(
        [j.importSpecifier(j.identifier(importedName))],
        j.literal(moduleName),
      ),
    });
  }
}
