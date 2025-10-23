// src/index.ts
import { createApp } from "./createApp";
import { env } from "./config/env";
import logger from "./utils/logger";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
