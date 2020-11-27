import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import User from "./User";

@Table({ freezeTableName: true })
class AutoReply extends Model<AutoReply> {
  @PrimaryKey
  @Column
  id: string;

  @Column(DataType.TEXT)
  name: string;

  @Default(0)
  @Column
  action: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;

  tableName: "AutoReply";
}

export default AutoReply;
