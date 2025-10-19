import { Model, DataTypes, CreationOptional } from "sequelize";
import { sequelize } from "../db";

export class FilesData extends Model {
  declare id: CreationOptional<string>;
  declare fileName: string;
  declare fileContent: object[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FilesData.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileContent: {
      type: DataTypes.JSON, // store array of objects
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "files_data",
    timestamps: true,
  }
);
