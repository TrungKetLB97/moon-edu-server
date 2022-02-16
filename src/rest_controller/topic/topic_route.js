const express = require("express");
const {updateTopic} = require("./topic_controller");
const {deleteTopic} = require("./topic_controller");
const {getAllTopic} = require("./topic_controller");
const {createTopic} = require("./topic_controller");

const TopicRouter = express.Router();

TopicRouter.post("/topic", createTopic);
TopicRouter.get("/topics", getAllTopic);
// TopicRouter.get("/get_all_answers", getAllAnswers);
TopicRouter.post("/remove_topic", deleteTopic);
TopicRouter.post("/update_topic", updateTopic);


module.exports = TopicRouter;
