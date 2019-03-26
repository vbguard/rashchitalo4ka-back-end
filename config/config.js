module.exports = {
  MondoDB: {
    url: "mongodb://127.0.0.1/rashchitalochka"
  },
  client: {
    development: {
      url: "http://localhost",
      port: "3000"
    }
  },
  jwt_encryption: process.env.JWT_ENCRYPTION || "jwt_please_change",
  jwt_expiration: process.env.JWT_EXPIRATION || 10000
};
