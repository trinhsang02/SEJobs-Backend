import "dotenv/config";

import { createApp } from "./createApp";
import { env } from "./config/env";
import logger from "./utils/logger";

if (env.NODE_ENV === "development") {
  const hasSmtp = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  logger.info(`📧 SMTP config loaded: ${hasSmtp ? "YES" : "NO (email will be mocked)"}`);
}

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
