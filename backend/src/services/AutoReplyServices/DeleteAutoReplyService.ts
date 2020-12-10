import AutoReply from "../../models/AutoReply";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";

const DeleteAutoReplyService = async (id: string): Promise<void> => {
  const autoReply = await AutoReply.findOne({
    where: { id }
  });

  const countTicket = await Ticket.findOne({ where: { autoReplyId: id } });
  if (countTicket) {
    throw new AppError("ERR_AUTO_REPLY_RELATIONED_TICKET", 404);
  }

  if (!autoReply) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  await autoReply.destroy();
};

export default DeleteAutoReplyService;
