// import AppError from "../../errors/AppError";
import StepsReplyAction from "../../../models/StepsReplyAction";

interface Request {
  stepReplyId: number;
  words: string;
  action: number;
  userId: number;
  queueId?: number;
  userIdDestination?: number;
  nextStepId?: number;
}

const CreateStepsReplyActionService = async ({
  stepReplyId,
  words,
  action,
  userId,
  queueId,
  userIdDestination,
  nextStepId
}: Request): Promise<StepsReplyAction> => {
  const stepsReplyAction = await StepsReplyAction.create({
    stepReplyId,
    words,
    action,
    userId,
    queueId,
    userIdDestination,
    nextStepId
  });

  return stepsReplyAction;
};

export default CreateStepsReplyActionService;
