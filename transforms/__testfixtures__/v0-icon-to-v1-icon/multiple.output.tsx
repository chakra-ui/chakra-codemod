import { Button, Box } from "@chakra-ui/core";

import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";

function Boxy() {
  return (
    <Button>
      <SearchIcon />
      <EditIcon />
      <Box>
        <DeleteIcon />
      </Box>
    </Button>
  );
}
