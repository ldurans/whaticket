import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import AutoReply from "../models/AutoReply";
import StepsReply from "../models/StepsReply";
import StepsReplyAction from "../models/StepsReplyAction";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  AutoReply,
  StepsReply,
  StepsReplyAction
];

sequelize.addModels(models);

export default sequelize;
