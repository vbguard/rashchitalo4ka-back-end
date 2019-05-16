module.exports = {
  MondoDB: {
    url: "mongodb://rash:ZBqZ_Yy8hGF2@127.0.0.1:27017/rashchitalochka"
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
