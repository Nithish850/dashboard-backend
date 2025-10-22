import { Request } from "express";
import { readCsvFile } from "../common/utils";
import alasql from "alasql";
import { FilesData } from "../database/models/files_data.model";

class UploadService {
  constructor() {}
  static async processCsv(req: Request): Promise<any> {
    let data: Record<string, any>[] = [];

    try {
      if (req.file && req.file.mimetype === "text/csv") {
        data = await readCsvFile(req.file.path);

        if (req.body?.fileId) {
          const update = await FilesData.update(
            { fileContent: data, fileName: req.file.originalname },
            { where: { id: req.body.fileId } }
          );

          if (update[0] === 0) {
            throw new Error(`File with id ${req.body.fileId} not found`);
          }

          return await FilesData.findOne({
            where: { id: req.body.fileId },
            attributes: ["id", "fileName"],
          }).then((record) => record?.dataValues);
        } else {
          const insert = await FilesData.create({
            fileName: req.file.originalname,
            fileContent: data,
          });

          return { id: insert.id };
        }
      }
    } catch (err) {
      throw new Error("catch error while upload file and edit file");
    }
  }

  static async getCsvDataByFileId(req: Request) {
    const { fileId } = req?.query;
    if (!fileId) {
      throw new Error("FileId is missing");
    }
    try {
      const result = await FilesData.findOne({
        where: { id: fileId },
        attributes: ["fileContent", "fileName"],
      });
      if (!result) {
        throw new Error(`File with Id ${fileId} not found`);
      }

      return result?.dataValues;
    } catch (err) {
      throw new Error("catch err while fetching the file data by fileid");
    }
  }

  static async getColumns(req: Request) {
    const { fileId } = req?.query;
    if (!fileId) {
      throw new Error("FileId is missing");
    }
    try {
      const data = await FilesData.findOne({
        where: { id: fileId },
        attributes: ["fileContent"],
      });

      if (!data?.dataValues) {
        throw new Error(`File with Id ${fileId} not found`);
      }
      const fileContentArray = data.dataValues.fileContent;

      return Object.keys(fileContentArray[0]);
    } catch (err) {
      throw new Error("Failed to retrieve columns");
    }
  }

  static async getDataByColumns(req: Request) {
    try {
      const payload = req.body;
      if (!payload?.fileId) {
        throw new Error("FileId is missing");
      }
      const data = await FilesData.findOne({
        where: { id: payload?.fileId },
        attributes: ["fileContent"],
      });

      if (!data?.dataValues) {
        throw new Error(`File with Id ${payload?.fileId} not found`);
      }
      const fileContentArray = data.dataValues.fileContent;

      if (fileContentArray?.length) {
        if (!payload?.xColumn || !payload?.yColumn) {
          throw new Error("X Column and Y Column is required");
        }
        const result = await alasql(
          `
              SELECT ${payload.xColumn} AS xAxis, ${
            payload?.functionality === "SUM" ? "SUM" : "COUNT"
          } (${payload.yColumn}) AS yAxis
                FROM ?
                GROUP BY ${payload.xColumn}
                `,
          [fileContentArray]
        );
        return result;
      }
    } catch (err) {
      throw new Error("Failed to retrieve data by columns");
    }
  }
}

export default UploadService;
