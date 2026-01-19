import "tsconfig-paths/register";
import "dotenv/config";

import { createApp } from "./createApp";
import { env } from "./config/env";
import logger from "./utils/logger";
// console.log("✓ All imports loaded successfully");
// console.log("Node version:", process.version);
// console.log("TypeScript running via:", process.env.TS_NODE_DEV ? "ts-node-dev" : "ts-node or other");

if (env.NODE_ENV === "development") {
  const hasSmtp = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  logger.info(`📧 SMTP config loaded: ${hasSmtp ? "YES" : "NO (email will be mocked)"}`);
}

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
