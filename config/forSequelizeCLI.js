const config = require("./index");

module.exports = {
  dialect: "postgres",
  host: config.get("db.host"),
  port: config.get("db.port"),
  database: config.get("db.name"),
  username: config.get("db.username"),
  password: config.get("db.password"),
};
