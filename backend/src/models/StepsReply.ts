import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import User from "./User";
import AutoReply from "./AutoReply";

@Table({ freezeTableName: true })
class StepsReply extends Model<StepsReply> {
  @PrimaryKey
  @Column
  id: string;

  @Column(DataType.TEXT)
  reply: string;

  @Column(DataType.INTEGER)
  stepOrder: string;

  @Column
  @ForeignKey(() => AutoReply)
  idAutoReply: number;

  @BelongsTo(() => AutoReply, "idAutoReply")
  autoReply: AutoReply;

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

  tableName: "StepsReply";
}

export default StepsReply;
