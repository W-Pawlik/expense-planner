import express from "express";
import { errorHandler } from "./core/errors/errorHandler";

export const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(errorHandler);

  return app;
};
