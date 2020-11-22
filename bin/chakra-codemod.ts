#!/usr/bin/env node

import { run } from "./cli";

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
