import { PseudoBox, Box, Button } from "@chakra-ui/core";

export function Basic(props) {
  return (
    <PseudoBox
      as="button"
      rounded="full"
      outline="0"
      w={["40px", "80px"]}
      h={["40px", "80px"]}
      {...props}>
      <Box rounded="full" w="12px" h="12px" />
      <Button variantColor="red">Click me</Button>
    </PseudoBox>
  );
}
