import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  AutoIncrement,
  AfterFind,
  BeforeUpdate,
  Default,
  AfterCreate
} from "sequelize-typescript";

import Contact from "./Contact";
import Message from "./Message";
import User from "./User";
import Whatsapp from "./Whatsapp";
import AutoReply from "./AutoReply";
import StepsReply from "./StepsReply";
import Queue from "./Queue";

import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import ShowStepAutoReplyMessageService from "../services/AutoReplyServices/ShowStepAutoReplyMessageService";

@Table
class Ticket extends Model<Ticket> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ defaultValue: "pending" })
  status: string;

  @Column(DataType.VIRTUAL)
  unreadMessages: number;

  @Column
  lastMessage: string;

  @Default(false)
  @Column
  isGroup: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @HasMany(() => Message)
  messages: Message[];

  @ForeignKey(() => AutoReply)
  @Column
  autoReplyId: number;

  @BelongsTo(() => AutoReply)
  autoReply: AutoReply;

  @ForeignKey(() => StepsReply)
  @Column
  stepAutoReplyId: number;

  @BelongsTo(() => StepsReply)
  stepsReply: StepsReply;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @AfterFind
  static async countTicketsUnreadMessages(tickets: Ticket[]): Promise<void> {
    if (tickets && tickets.length > 0) {
      await Promise.all(
        tickets.map(async ticket => {
          ticket.unreadMessages = await Message.count({
            where: { ticketId: ticket.id, read: false }
          });
        })
      );
    }
  }

  @BeforeUpdate
  static async countTicketUnreadMessags(ticket: Ticket): Promise<void> {
    ticket.unreadMessages = await Message.count({
      where: { ticketId: ticket.id, read: false }
    });
  }

  @AfterCreate
  static async AutoReplyWelcome(instance: Ticket): Promise<void> {
    if (instance.contactId === 1) {
      const stepAutoReply = await ShowStepAutoReplyMessageService(
        0,
        0,
        0,
        true
      );
      await instance.update({
        autoReplyId: stepAutoReply.autoReply.id,
        stepAutoReplyId: stepAutoReply.id
      });
      const ticket = await ShowTicketService(instance.id);
      if (stepAutoReply) {
        await SendWhatsAppMessage({
          body: stepAutoReply.reply,
          ticket,
          quotedMsg: undefined
        });
        await SetTicketMessagesAsRead(ticket);
      }
    }
  }
}

export default Ticket;
