import { createRequestHandler } from "@remix-run/serve";
import { installGlobals } from "@remix-run/node";
import * as fs from "fs";

installGlobals();

const BUILD_PATH = "./build/server/index.js";
const PORT = process.env.PORT || 3000;

const build = await import(BUILD_PATH);

const handler = createRequestHandler(build, process.env.NODE_ENV);

import { createServer } from "http";
const server = createServer(handler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
