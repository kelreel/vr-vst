const config = {
  db: process.env.db,
  port: process.env.port,
  tokenSecret: process.env.tokenSecret,
  tokenExpiration: process.env.tokenExpiration
};

export default config;
