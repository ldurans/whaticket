require("../bootstrap");

module.exports = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
    // freezeTableName: true
  },
  dialect: process.env.DB_DIALECT || "postgres",
  timezone: "UTC",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "whatsapp",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "marina@0509",
  logging: console.log
};
