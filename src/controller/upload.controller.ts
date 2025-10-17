import { Request, Response, NextFunction } from "express";
import UploadService from "../service/upload.service";

class UploadController {
  static async uploadCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await UploadService.processCsv(req);
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getColumns(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await UploadService.getColumns(req);
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UploadController;
