const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const redis = require("redis");
const config = require("config");

app.use(
  session({
    secret: "vietpro-secret",
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false },
    store: new redisStore({
      client: redis.createClient(config.get("redis")),
    }),
  })
);

// console.log(process.env);

require("../libs/mongo-db");

app.use(require("../apps/middlewares/share-data"));

app.use("/assets", express.static(path.join(__dirname, "..", "public")));

//Using body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Using template engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");

// app.use("/api", require("../routers/api"));
app.use("/", require("../routers/web"));

app.use("*", function (req, res) {
  return res.render("404");
});

app.use((error, req, res, next) => {
  console.log("error", error.message);
  return res.json({
    status: "error",
    message: error.message,
  });
});

module.exports = app;
