import * as http from "http";
import * as debug from "debug";

import Main from "./main";

const server = http.createServer(Main);

/**
 * Coerce a port number into its integer representation
 * @param val - a number or string representing port number
 */
function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}
const port = normalizePort(process.env.PORT || 3000);

debug("ts-express:server");

/**
 * Event handler for error events in the ExpressJS server.
 * @param error - NodeJS error, typically thrown by Express middleware
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

Main.set("port", port);

/**
 * Event handler for listening event (this is basically a hook for late-startup)
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

console.log(`The server is listening on port ${port}.`);
