import express from "express";
import uploaderRoutes from "./uploader.routes";

export default () => {
  const router = express.Router();

  uploaderRoutes(router);

  return router;
};
