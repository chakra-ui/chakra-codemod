import "@chakra-ui/theme-tools";
import type { SystemStyleFunction } from "@chakra-ui/theme-tools";

const replacesInsideObject: SystemStyleFunction = (props) => {
  return {
    transform: "translate(25%, 25%)",
    borderRadius: "full",
    border: "0.2em solid",

    _light: {
      borderColor: "white"
    },

    _dark: {
      borderColor: "gray.800"
    }
  };
};

const createsVariablesIfOutsideObject: SystemStyleFunction = (props) => {
  const borderColorLight = "white";
  const borderColorDark = "gray.800";
  const bgColorDark = "gray.800";
  const bgColorLight = "white";

  return {
    _light: {
      borderColor: borderColorLight,
      bg: bgColorLight
    },
    _dark: {
      borderColor: borderColorDark,
      bg: bgColorDark
    },
  };
};

const mergesWithExisting: SystemStyleFunction = (props) => {
  const borderColorLight = "white";
  const borderColorDark = "gray.800";

  return {
    _light: {
      color: "red.500",
      borderColor: borderColorLight
    },
    _dark: {
      borderColor: borderColorDark
    },
  };
};

const worksWithNestedObjects: SystemStyleFunction = (props) => {
  const borderColorLight = "white";
  const borderColorDark = "gray.800";

  return {
    _focus: {
      _light: {
        color: "red.500",
        borderColor: borderColorLight
      },
      _dark: {
        borderColor: borderColorDark
      },
    },
  };
};

const usesExistingVariable: SystemStyleFunction = (props) => {
  const colorDark = "red.500";
  const colorLight = "blue.500";

  return {
    _light: {
      borderColor: colorDark
    },

    _dark: {
      borderColor: colorLight
    }
  };
};
