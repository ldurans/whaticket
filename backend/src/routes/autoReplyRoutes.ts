import express from "express";
import isAuth from "../middleware/isAuth";

import * as AutoReplyController from "../controllers/AutoReplyController";
import * as StepsReplyController from "../controllers/StepsReplyController";

const autoReplyRoutes = express.Router();

autoReplyRoutes.post("/auto-reply", isAuth, AutoReplyController.store);
autoReplyRoutes.get("/auto-reply", isAuth, AutoReplyController.index);
autoReplyRoutes.put(
  "/auto-reply/:autoReplyId",
  isAuth,
  AutoReplyController.update
);
autoReplyRoutes.delete(
  "/auto-reply/:autoReplyId",
  isAuth,
  AutoReplyController.remove
);

autoReplyRoutes.post(
  "/auto-reply/:idAutoReply/steps",
  isAuth,
  StepsReplyController.store
);
autoReplyRoutes.put(
  "/auto-reply/:idAutoReply/steps/:stepsReplyId",
  isAuth,
  StepsReplyController.update
);

export default autoReplyRoutes;
