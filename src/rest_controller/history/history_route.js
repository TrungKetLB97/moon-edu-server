const express = require("express");
const verifyToken = require("../../system/midleware/auth_controller");
const {updateHistory} = require("./history_controller");
const {getAllHistory} = require("./history_controller");
const {createHistory} = require("./history_controller");


const HistoryRouter = express.Router();

HistoryRouter.post("/history",verifyToken, createHistory);
HistoryRouter.get("/histories",verifyToken, getAllHistory);
HistoryRouter.post("/history/update",verifyToken, updateHistory);


module.exports = HistoryRouter;
