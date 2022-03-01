const express = require("express");
const verifyToken = require("../../system/midleware/auth_controller");
const {resetPassword} = require("./user_controller");
const {changePassword} = require("./user_controller");
const {getUserInfo} = require("./user_controller");
const {login} = require("./user_controller");
const {updateUser} = require("./user_controller");
const {deleteUser} = require("./user_controller");
const {getListUser} = require("./user_controller");
const {register} = require('./user_controller')

const UserRouter = express.Router();

UserRouter.post("/user/register", register);
UserRouter.post("/user/login", login);
UserRouter.get("/user/list", getListUser);
UserRouter.post("/user/delete", deleteUser);
UserRouter.post("/user/update", updateUser);
UserRouter.get("/user/info",verifyToken, getUserInfo);
UserRouter.post("/user/change-password",verifyToken, changePassword);
UserRouter.post("/user/reset-password", resetPassword);


module.exports = UserRouter;
