import AutoReply from "../../models/AutoReply";
import AppError from "../../errors/AppError";

const DeleteAutoReplyService = async (id: string): Promise<void> => {
  const autoReply = await AutoReply.findOne({
    where: { id }
  });

  if (!autoReply) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  await autoReply.destroy();
};

export default DeleteAutoReplyService;
