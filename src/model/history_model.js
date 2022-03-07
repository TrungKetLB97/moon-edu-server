const mongoose = require("mongoose");
const {getAutoIncrement} = require("../system/constant");
const AutoIncrement = require("mongoose-auto-increment");

// Tên collection trong db
const nameCollection = "histories";

// Khởi tạo 1 đối tượng
const HistoryModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true, // Không cho phép sửa
    },
    name: String,
    topic: Object,
    point: Number,
    createdAt: Object,
    createdBy: Number,
    updatedAt: Object,
    updatedBy: Number,
});

AutoIncrement.initialize(mongoose.connection);
// áp dụng plugin tự tăng vào collection
HistoryModel.plugin(AutoIncrement.plugin, getAutoIncrement(nameCollection));

module.exports = mongoose.model(nameCollection, HistoryModel);
