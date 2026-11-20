import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const labDirectory = fileURLToPath(new URL(".", import.meta.url));
const allowedFiles = new Set(["index.html", "styles.css", "example.js"]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

export function createLabServer() {
  return createServer(async (request, response) => {
    const requestPath = new URL(request.url, "http://localhost").pathname;
    const fileName = requestPath === "/" ? "index.html" : requestPath.slice(1);

    if (!allowedFiles.has(fileName)) {
      response.writeHead(404).end("Not found");
      return;
    }

    try {
      const fileContents = await readFile(resolve(labDirectory, fileName));
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes[extname(fileName)],
      });
      response.end(fileContents);
    } catch {
      response.writeHead(500).end("Could not load the lab file");
    }
  });
}