import { bootstrap } from "./cli";

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
