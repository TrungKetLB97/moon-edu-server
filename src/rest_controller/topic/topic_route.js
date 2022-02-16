const express = require("express");
const {getAllTopic} = require("./topic_controller");
const {createTopic} = require("./topic_controller");

const TopicRouter = express.Router();

TopicRouter.post("/topic", createTopic);
TopicRouter.get("/topics", getAllTopic);
// TopicRouter.get("/get_all_answers", getAllAnswers);
// TopicRouter.post("/delete_answers", deleteAnswer);
// TopicRouter.post("/update_answers", updateAnswer);


module.exports = TopicRouter;
