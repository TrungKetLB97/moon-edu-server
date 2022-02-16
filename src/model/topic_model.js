const mongoose = require("mongoose");
const {getAutoIncrement} = require("../system/constant");
const AutoIncrement = require("mongoose-auto-increment");

// Tên collection trong db
const nameCollection = "topics";

// Khởi tạo 1 đối tượng
const TopicModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true, // Không cho phép sửa
    },
    name: String,
    topicType:String,
    description: String,
    enable: Boolean,
    image:String,
    createdAt: Object,
    createdBy: Number,
    updatedAt: Object,
    updatedBy: Number,
});

AutoIncrement.initialize(mongoose.connection);
// áp dụng plugin tự tăng vào collection
TopicModel.plugin(AutoIncrement.plugin, getAutoIncrement(nameCollection));

module.exports = mongoose.model(nameCollection, TopicModel);
