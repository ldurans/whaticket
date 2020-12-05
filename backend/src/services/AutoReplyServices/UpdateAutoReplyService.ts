import AppError from "../../errors/AppError";
import AutoReply from "../../models/AutoReply";

interface AutoReplyData {
  name: string;
  action: number;
  userId: number;
}

interface Request {
  autoReplyData: AutoReplyData;
  autoReplyId: string;
}

const UpdateAutoReplyService = async ({
  autoReplyData,
  autoReplyId
}: Request): Promise<AutoReply> => {
  const { name, action, userId } = autoReplyData;

  const autoReply = await AutoReply.findOne({
    where: { id: autoReplyId },
    attributes: ["id", "name", "action", "userId"]
  });

  if (!autoReply) {
    throw new AppError("ERR_NO_AUTO_REPLY_FOUND", 404);
  }

  await autoReply.update({
    name,
    action,
    userId
  });

  await autoReply.reload({
    attributes: ["id", "name", "action", "userId"]
  });

  return autoReply;
};

export default UpdateAutoReplyService;
