import { Router } from "express";
import { upload } from "../middleware/upload";
import UploadController from "../controller/upload.controller";

export default (router: Router) => {
  router.post("/upload-csv", upload.single("file"), UploadController.uploadCsv);
  router.get(
    "/get-file-data",
    upload.single("file"),
    UploadController.getFileDataByFileId
  );
  router.get("/get-columns", UploadController.getColumns);
  router.post("/get-data-by-columns", UploadController.getDataByColumns);
};
