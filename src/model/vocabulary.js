const mongoose = require("mongoose");
const {getAutoIncrement} = require("../system/constant");
const AutoIncrement = require("mongoose-auto-increment");

// Tên collection trong db
const nameCollection = "vocabularies";

// Khởi tạo 1 đối tượng
const VocabularyModel = new mongoose.Schema({
    id: {
        type: Number,
        immutable: true, // Không cho phép sửa
    },
    english: String,
    vietnamese:String,
    pronunce:String,
    vocabType:String,
    enable: Boolean,
    createdAt: Object,
    createdBy: Number,
    updatedAt: Object,
    updatedBy: Number,
});

AutoIncrement.initialize(mongoose.connection);
// áp dụng plugin tự tăng vào collection
VocabularyModel.plugin(AutoIncrement.plugin, getAutoIncrement(nameCollection));

module.exports = mongoose.model(nameCollection, VocabularyModel);
