const config = {
  env: process.env.NODE_ENV || "development",
  port: process.nextTick.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    "mongodb+srv://cdevjarrell:0bl1v10n@cluster0.2icso.mongodb.net/guitar-academy?retryWrites=true&w=majority",
};

export default config;
