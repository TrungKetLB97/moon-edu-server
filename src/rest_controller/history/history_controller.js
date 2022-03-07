const {getNowFormatted, format, datePattern} = require("../../system/utils");
const {uploadImage} = require("../../system/module/file_utils");
const HistoryModel = require('../../model/history_model')
const TopicModel = require('../../model/topic_model')
const {JsonList} = require("../../system/base_json");
const {JsonObject} = require("../../system/base_json");

const createHistory = async (req, res) => {
    // let mTopic = await TopicModel.findOne({"id": req.body.topic})
    // if (mTopic == null) {
    //     return res.status(200).json(JsonObject({
    //         code: 1,
    //         message: 'Topic không tồn tại'
    //     }));
    // }
    // tạo đối tượng topic
    const historyModel = new HistoryModel({
        name: req.body.name,
        topic: req.body.topic,
        point: req.body.point,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    // lưu topic vào db
    return historyModel.save()
        .then(async (data) => {
            data.topic = await TopicModel.findOne({'id': data.topic});
            if(data.topic){
                data.topic.createdAt = format(data.topic.createdAt, datePattern);
                data.topic.updatedAt = format(data.topic.updatedAt, datePattern);
            }
            // format lại thời gian về kiểu dd/mm/yyyy hh:mm:ss
            data.createdAt = format(data.createdAt, datePattern);
            return res.status(200).json(JsonObject({
                code: 0,
                data: data
            }));
        })
        .catch((error) => {
            return res.status(200).json(JsonObject({
                code: 99,
                data: error
            }));
        });
};

const getAllHistory = async (req, res) => {

    let filter = {};
    if (req.query.name) {
        filter['name'] = {"$regex": req.query.name, "$options": "i"}
    }
    filter['createdBy'] = req.user.id;
    //Lấy tất cả các lich sử lấy các trường id content createdBy createdAt updatedAt updatedBy
    HistoryModel.find(filter)
        .select("id name topic point createdBy createdAt updatedAt updatedBy")
        .then( async (data) => {
            for (var i =0; i< data.length; i++) {
                data[i].topic = await TopicModel.findOne({'id': data[i].topic});
                data[i].topic.createdAt = format(data[i].topic.createdAt, datePattern);
                data[i].topic.updatedAt = format(data[i].topic.updatedAt, datePattern);
                // format lại thời gian về kiểu dd/mm/yyyy hh:mm:ss
                data[i].createdAt = format(data[i].createdAt, datePattern);
                data[i].updatedAt = format(data[i].updatedAt, datePattern);
            }

            return res.status(200).json(
                JsonObject({
                    code: 0,
                    data: JsonList(1, data.length, data.length, data),
                })
            );
        })
        .catch((error) => {
            return res.status(200).json(
                JsonObject({
                    code: 99,
                    data: error,
                })
            );
        });
};

const updateHistory = async (req, res) => {
    if(req.body.id == null){
        return res.status(200).json(
            JsonObject({
                code: 1,
                data: 'Id is required'
            })
        );
    }
    let mHistory = await HistoryModel.findOne({'id': req.body.id})
    if(mHistory == null){
        return res.status(200).json(
            JsonObject({
                code: 1,
                message: 'Không tồn tại lịch sử này'
            })
        );
    }
    // Cập nhật lại history
    HistoryModel.updateOne({id: req.body.id},
        {
            $set: {
                name: req.body.name,
                point: req.body.point,
                topic: req.body.topic,
                updatedBy: req.user.id,
                updatedAt: getNowFormatted(),
            },
        })
        .then(() => {
            return res.status(200).json(
                JsonObject({
                    code: 0,
                    data: {}
                })
            );
        })
        .catch((error) => {
            return res.status(200).json(
                JsonObject({
                    code: 99,
                    data: error
                })
            );
        });
};


module.exports = {
    createHistory,
    getAllHistory,
    updateHistory,
};
