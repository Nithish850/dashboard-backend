import { Request } from "express";
import { readCsvFile } from "../common/utils";
import { sequelize } from "../database/db";
import { QueryTypes } from "sequelize";
import { FileRecord } from "../interface/uploadService.interface";
import { v4 as uuidv4 } from "uuid";

class UploadService {
  static async processCsv(req: Request): Promise<any[]> {
    if (!req.file || (req.file.mimetype !== "text/csv" && !req.body?.fileId)) {
      throw new Error("file id or CSV file is required");
    }

    let data: Record<string, any>[] = [];

    if (req.file && req.file.mimetype === "text/csv") {
      data = await readCsvFile(req.file.path);

      if (req.body?.fileId) {
        // Both file and fileId provided - UPDATE scenario
        const update = await sequelize.query(
          `UPDATE files_data SET file_content = :fileContent, file_name = :fileName, updated_at = NOW() WHERE id = :fileId`,
          {
            replacements: {
              fileContent: JSON.stringify(data),
              fileName: req.file.originalname,
              fileId: req.body.fileId,
            },
            type: QueryTypes.UPDATE,
          }
        );

        if (update[1] === 0) {
          throw new Error(`File with id ${req.body.fileId} not found`);
        }

        return data;
      } else {
        // Only file provided - INSERT scenario
        const fileId = uuidv4();

        await sequelize.query(
          `INSERT INTO files_data (id, file_name, file_content, created_at, updated_at) VALUES (:id, :fileName, :fileContent, NOW(), NOW())`,
          {
            replacements: {
              id: fileId,
              fileName: req.file.originalname,
              fileContent: JSON.stringify(data),
            },
            type: QueryTypes.INSERT,
          }
        );

        return data;
      }
    } else if (req.body?.fileId) {
      // Only fileId provided - RETRIEVE scenario
      const result = (await sequelize.query(
        `SELECT * FROM files_data WHERE id = :fileId`,
        {
          replacements: {
            fileId: req.body.fileId,
          },
          type: QueryTypes.SELECT,
        }
      )) as FileRecord[];

      if (!result || result.length === 0) {
        throw new Error(`File with id ${req.body.fileId} not found`);
      }

      data = result[0].file_content;

      return data;
    } else {
      throw new Error("Either a CSV file or file ID is required");
    }
  }

  static async getColumns(req: Request) {
    try {
      const data = await readCsvFile(process.env.CSV_FILE_PATH!, false);
      if (data?.length) {
        return Object.keys(data[0]);
      }
    } catch (err) {
      throw err;
    }
  }
}

export default UploadService;
