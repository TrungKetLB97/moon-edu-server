const express = require("express");
const verifyToken = require("../../system/midleware/auth_controller");
const {updateTopic} = require("./topic_controller");
const {deleteTopic} = require("./topic_controller");
const {getAllTopic} = require("./topic_controller");
const {createTopic} = require("./topic_controller");

const TopicRouter = express.Router();

TopicRouter.post("/topic",verifyToken, createTopic);
TopicRouter.get("/topics",verifyToken, getAllTopic);
TopicRouter.post("/remove_topic",verifyToken, deleteTopic);
TopicRouter.post("/update_topic",verifyToken, updateTopic);


module.exports = TopicRouter;
