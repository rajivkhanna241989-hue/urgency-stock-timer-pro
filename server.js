import { createRequestHandler } from "@remix-run/express";
import express from "express";

const app = express();
app.use(express.static("build/client"));

app.all("*", createRequestHandler({
  build: await import("./build/server/index.js"),
}));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + (process.env.PORT || 3000));
});
