"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { upperFirst, camelCase } = require("lodash");
const basename = path.basename(__filename);
const config = require("../config");
const db = {};

let sequelize = new Sequelize(
  config.get("db.name"),
  config.get("db.username"),
  config.get("db.password"),
  {
    host: config.get("db.host"),
    port: config.get("db.port"),
    dialect: "postgres",
    pool: {
      max: 10,
      min: 0,
      acquire: 120 * 1000,
    },
    logging: () => process.env.NODE_ENV === "development",
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    const name = upperFirst(camelCase(model.name));
    db[name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
