import { Request } from "express";
import { readCsvFile } from "../common/utils";

class UploadService {
  static async processCsv(req: Request): Promise<any[]> {
    if (!req.file || req.file.mimetype !== "text/csv") {
      throw new Error("CSV file is required");
    }
    const data = await readCsvFile(req.file.path);
    return data;
  }
}

export default UploadService;
