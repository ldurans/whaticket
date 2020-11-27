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
  ForeignKey,
  BeforeUpsert
} from "sequelize-typescript";
import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import ShowStepAutoReplyMessageService from "../services/AutoReplyServices/ShowStepAutoReplyMessageService";
import VerifyActionStepAutoReplyService from "../services/AutoReplyServices/VerifyActionStepAutoReplyService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import Contact from "./Contact";
import Ticket from "./Ticket";

@Table
class Message extends Model<Message> {
  @PrimaryKey
  @Column
  id: string;

  @Default(0)
  @Column
  ack: number;

  @Default(false)
  @Column
  read: boolean;

  @Default(false)
  @Column
  fromMe: boolean;

  @Column(DataType.TEXT)
  body: string;

  @Column(DataType.STRING)
  get mediaUrl(): string | null {
    if (this.getDataValue("mediaUrl")) {
      const { BACKEND_URL } = process.env;
      const value = this.getDataValue("mediaUrl");
      return `${BACKEND_URL}:${process.env.PROXY_PORT}/public/${value}`;
    }
    return null;
  }

  @Column
  mediaType: string;

  @Default(false)
  @Column
  isDeleted: boolean;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;

  @ForeignKey(() => Message)
  @Column
  quotedMsgId: string;

  @BelongsTo(() => Message, "quotedMsgId")
  quotedMsg: Message;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact, "contactId")
  contact: Contact;

  @BeforeUpsert
  static async AutoReplyActionTicket(instance: Message): Promise<void> {
    console.log("message BeforeUpsert", instance);
    const ticket = await ShowTicketService(instance.ticketId);
    if (
      ticket.autoReplyId &&
      ticket.contactId === 1 &&
      ticket.status === "pending" &&
      !instance.fromMe
    ) {
      console.log("Entou no IF", ticket);
      if (ticket.autoReplyId) {
        const actionAutoReply = await VerifyActionStepAutoReplyService(
          ticket.stepAutoReplyId,
          instance.body
        );
        if (actionAutoReply) {
          // action = 0: enviar para proximo step: nextStepId
          if (actionAutoReply.action === 0) {
            await ticket.update({
              stepAutoReplyId: actionAutoReply.nextStepId
            });
            const stepAutoReply = await ShowStepAutoReplyMessageService(
              0,
              actionAutoReply.stepReplyId,
              actionAutoReply.nextStepId
            );

            await SendWhatsAppMessage({
              body: stepAutoReply.reply,
              ticket,
              quotedMsg: undefined
            });
            await SetTicketMessagesAsRead(ticket);
          }

          // action = 1: enviar para fila: queue
          if (actionAutoReply.action === 1) {
            ticket.update({
              queue: actionAutoReply.queue,
              autoReplyId: null,
              stepAutoReplyId: null
            });
          }

          // action = 2: enviar para determinado usuário
          if (actionAutoReply.action === 2) {
            ticket.update({
              userId: actionAutoReply.userIdDestination,
              status: "open",
              autoReplyId: null,
              stepAutoReplyId: null
            });
          }
        } else {
          console.log("not step action");
          const stepAutoReply = await ShowStepAutoReplyMessageService(
            0,
            ticket.autoReplyId,
            ticket.stepAutoReplyId
          );
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
}

export default Message;
