const config = require("config");
const path = require("path");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: "~/mydb.sqlite"
    }
  },
  
  staging: {
    client: 'sqlite3',
    connection: {
      filename: "~/mydb.sqlite"
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: "~/mydb.sqlite"
    }
  }
};
