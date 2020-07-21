const http = require("http");
const app = require("../bootstrap/app");
const appConfig = require("../config/default");
// const config = require("config");

// const port = config.get("app.PORT");
const port = appConfig.app.PORT;

const server = http.createServer(app);

server.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});
