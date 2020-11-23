import { JSXAttribute, Transform } from "jscodeshift";
import camelCase from "lodash.camelcase";
import { createJSXElement } from "../utils/jsx";
import {
  insertOrCreateSubmoduleImport,
  removeModuleImport,
} from "../utils/module";
import { capitalize, prepare } from "../utils/shared";
import { icons } from "../utils/v0-components";

const iconsPkgName = "@chakra-ui/icons";

const transformer: Transform = (file, api) => {
  const config = prepare(file, api);
  const { j, root, done } = config;

  /**
   * Find all Icon jsx and grab the name attr's value
   */
  root
    .findJSXElements("Icon")
    .filter(
      j.filters.JSXElement.hasAttributes({
        name: () => true,
      }),
    )
    .replaceWith((node) => {
      const v0Props = node.value.openingElement.attributes as JSXAttribute[];
      const { value } = v0Props.find((prop) => prop.name.name === "name");

      /**
       * Check that the value is a string literal not a JSXExpression
       */
      const v0IconName =
        value.type === "StringLiteral" ? value.value : undefined;

      if (!v0IconName) return node;

      let moduleName = iconsPkgName;

      if (!icons.includes(v0IconName)) {
        console.log(
          `"${v0IconName}" seems to be a custom icon you added to the v0 theme object.`,
          `Kindly extract it to a react component for better treeshaking following this guide`,
          `https://chakra-ui.com/docs/components/icon#using-the-createicon-function`,
        );
        moduleName = "./REPLACE_WITH_ICON_DIRECTORY";
      }

      const v1Props = v0Props.filter((prop) => prop.name.name !== "name");
      const v1IconName = `${capitalize(camelCase(v0IconName))}Icon`;

      /**
       * Create a JSX element of `${camelCase(name)}Icon`
       * forward any props passed to Icon to new component
       */
      const v1Icon = createJSXElement(j, v1IconName, v1Props);

      insertOrCreateSubmoduleImport(j, root, {
        importedName: v1IconName,
        moduleName,
      });

      return v1Icon;
    });

  removeModuleImport(j, root, {
    moduleName: "@chakra-ui/core",
    selector: "Icon",
  });

  // console.log("Replaced icon syntax, kindly install `@chakra-ui/icons`");

  return done();
};

export default transformer;
