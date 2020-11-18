import { Icon, Button, Box } from "@chakra-ui/core";

function Boxy() {
  return (
    <Button>
      <Icon name="search" />
      <Icon name="edit" />
      <Box>
        <Icon name="delete" />
      </Box>
    </Button>
  );
}
