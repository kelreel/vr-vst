const fs = require("fs");
const http = require("http");
const https = require("https");

require("dotenv").config();

const db = require("./db");
import app from './app'
import config from './config';
import { logger } from './services/LoggerService';

const httpServer = http.createServer(app);

httpServer.listen(config.port, () => {
  logger.info(`HTTP Server running on port ${config.port}`);
});