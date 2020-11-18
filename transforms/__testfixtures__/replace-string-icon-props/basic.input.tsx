import { Button, IconButton, Box } from "@chakra-ui/core";

function Example(props) {
  return (
    <Box>
      <Button leftIcon="phone">Click me</Button>
      <IconButton icon="email" />
    </Box>
  );
}
