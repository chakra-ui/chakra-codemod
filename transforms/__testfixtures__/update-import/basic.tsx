import { PseudoBox, PseudoBoxProps, Box } from "@chakra-ui/core";

interface ButtonProps extends PseudoBoxProps {}

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <PseudoBox
      w="40px"
      bg="red.300"
      _hover={{
        bg: "red.400",
      }}
      {...rest}
    >
      <Box>{children}</Box>
    </PseudoBox>
  );
}
