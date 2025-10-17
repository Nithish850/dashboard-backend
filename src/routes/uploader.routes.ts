import { Router } from "express";
import { upload } from "../middleware/upload";
import UploadController from "../controller/upload.controller";

export default (router: Router) => {
  router.post("/upload-csv", upload.single("file"), UploadController.uploadCsv);
  router.get("/get-columns", UploadController.getColumns);
};
