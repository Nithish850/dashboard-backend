import fs from "fs";
import csvParser from "csv-parser";

/**
 * Reads a CSV file and converts it to JSON.
 * @param filePath - Path to the CSV file
 * @param deleteAfterRead - Whether to delete the file after reading (default: true)
 * @returns Promise<any[]> - Array of objects representing CSV rows
 */
export const readCsvFile = (
  filePath: string,
  deleteAfterRead = true
): Promise<any[]> => {
  try {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          if (deleteAfterRead) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error("Failed to delete CSV file:", err);
            }
          }
          resolve(cleanCsvData(results));
        })
        .on("error", (err) => reject(err));
    });
  } catch (err) {
    console.log("Error reading CSV file:", err);
    throw new Error("Failed to read CSV file");
  }
};

export const cleanCsvData = (data: Record<string, any>[]) => {
  if (!Array.isArray(data)) return [];

  return data.map((row) => {
    const cleanedRow: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      const trimmed = String(value ?? "").trim();

      // Convert numeric strings (e.g., "123", "45.67") into numbers
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        cleanedRow[key] = Number(trimmed);
      } else {
        cleanedRow[key] = trimmed;
      }
    }

    return cleanedRow;
  });
};
