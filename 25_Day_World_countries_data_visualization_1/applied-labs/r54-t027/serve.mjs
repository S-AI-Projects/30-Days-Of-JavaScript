import { createLabServer } from "./server.mjs";

const server = createLabServer();

server.listen(4173, "127.0.0.1", () => {
  console.log("Country filter is running at http://127.0.0.1:4173");
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});