const mongoose = require("mongoose");
const config = require("config");

require("../apps/models/category");
require("../apps/models/product");
require("../apps/models/user");
require("../apps/models/comment");

const uris = config.get("mongo.uri");

mongoose.connect(uris);
