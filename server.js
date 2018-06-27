const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

// We make sure the port is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Checks which type of error occurred
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};


const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

// Calling the normalized port function, setting up the port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);


const server = http.createServer(app);
server.on("error", onError);             // Listener for errors
server.on("listening", onListening);     // Listener for input
server.listen(port);  // START A SERVER
// We use npm 'install --save-dev nodemon' to automaticaly restart the server
