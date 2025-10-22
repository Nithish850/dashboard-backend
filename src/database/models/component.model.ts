import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "components",
  timestamps: true,
})
export class Components extends Model<Components> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.STRING(255),
    field: "id",
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: "component_name",
  })
  componentName!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: "component_type",
  })
  componentType!: string;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "created_at",
  })
  createdAt!: Date;

  @UpdatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: "updated_at",
  })
  updatedAt!: Date;
}
