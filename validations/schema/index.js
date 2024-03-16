const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { lowerFirst, camelCase } = require("lodash");
const schema = {};

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
    const schemaFile = require(path.join(__dirname, file));
    const name = lowerFirst(camelCase(file));
    schema[name.slice(0, -2)] = schemaFile;
  });

module.exports = schema;
