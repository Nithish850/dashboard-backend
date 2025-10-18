import { Request } from "express";
import { readCsvFile } from "../common/utils";
import { sequelize } from "../database/db";
import { QueryTypes } from "sequelize";
import { FileRecord } from "../interface/uploadService.interface";
import { v4 as uuidv4 } from "uuid";
import alasql from "alasql";
import { FilesData } from "../database/models/fiels_data.model";

class UploadService {
  constructor(private readonly filesData: typeof FilesData) {}
  static async processCsv(req: Request): Promise<any[]> {
    if (!req.file || (req.file.mimetype !== "text/csv" && !req.body?.fileId)) {
      throw new Error("file id or CSV file is required");
    }

    let data: Record<string, any>[] = [];

    if (req.file && req.file.mimetype === "text/csv") {
      data = await readCsvFile(req.file.path);

      if (req.body?.fileId) {
        // Both file and fileId provided - UPDATE scenario
        // const update = await sequelize.query(
        //   `UPDATE files_data SET file_content = :fileContent, file_name = :fileName, updated_at = NOW() WHERE id = :fileId`,
        //   {
        //     replacements: {
        //       fileContent: JSON.stringify(data),
        //       fileName: req.file.originalname,
        //       fileId: req.body.fileId,
        //     },
        //     type: QueryTypes.UPDATE,
        //   }
        // );

        const update = await FilesData.update(
          { fileContent: data, fileName: req.file.originalname },
          { where: { id: req.body.fileId } }
        );

        if (update[0] === 0) {
          throw new Error(`File with id ${req.body.fileId} not found`);
        }

        return await FilesData.findOne({
          where: { id: req.body.fileId },
        }).then((record) => record?.dataValues);
      } else {
        const insert = await FilesData.create({
          fileName: req.file.originalname,
          fileContent: data,
        });

        return insert.dataValues;
      }
    } else if (req.body?.fileId) {
      // Only fileId provided - RETRIEVE scenario
      const result = FilesData.findOne({
        where: { id: req.body.fileId },
      });

      //   if (!result || result.length === 0) {
      //     throw new Error(`File with id ${req.body.fileId} not found`);
      //   }

      //   data = result[0].file_content;

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
      throw new Error("Failed to retrieve columns");
    }
  }

  static async getDataByColumns(req: Request) {
    try {
      const payload = req.body;
      const data = await readCsvFile(process.env.CSV_FILE_PATH!, false);
      if (data?.length) {
        if (!payload?.xColumn || !payload?.yColumn) {
          throw new Error("X Column and Y Column is required");
        }
        const result = await alasql(
          `
                SELECT ${payload.xColumn} AS xAxis, SUM(${payload.yColumn}) AS yAxis
                FROM ?
                GROUP BY ${payload.xColumn}
                `,
          [data]
        );
        return result;
      }
    } catch (err) {
      throw new Error("Failed to retrieve data by columns");
    }
  }
}

export default UploadService;
