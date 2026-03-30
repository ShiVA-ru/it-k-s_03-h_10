import config from "../../../src/core/settings/config";
import { closeDB, runDB } from "../../../src/db/mongo";
import { setupApp } from "../../../src/setup-app";
import express from "express";
import { generateBasicAuthToken } from "./generate-admin-auth-token";

export const commonTestManager = {
  adminToken: generateBasicAuthToken(),
  async initApp() {
    const app = express();
    setupApp(app);

    await runDB(config.mongoUrl);

    return app;
  },

  async closeApp() {
    await closeDB();
  },
};
