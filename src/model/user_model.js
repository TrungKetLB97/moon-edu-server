const mongoose = require("mongoose");
const {getAutoIncrement} = require("../system/constant");
const AutoIncrement = require("mongoose-auto-increment");

// Tên collection trong db
const nameCollection = "users";

// Khởi tạo 1 đối tượng
const UserModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true, // Không cho phép sửa
    },
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    password: String,
    email: String,
    gender: String,
    address: String,
    phoneNumber: String,
    birth: Object,
    token: String,
    permission: [],
    avatar: String,
    fcmToken :String,
    createdAt: Object,
    updatedAt: Object
});

AutoIncrement.initialize(mongoose.connection);
// áp dụng plugin tự tăng vào collection
UserModel.plugin(AutoIncrement.plugin, getAutoIncrement(nameCollection));

module.exports = mongoose.model(nameCollection, UserModel);
