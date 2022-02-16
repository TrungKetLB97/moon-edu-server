const {getNowFormatted, format, datePattern} = require("../../system/utils");
const TopicModel = require('../../model/topic_model')
const {JsonList} = require("../../system/base_json");
const {JsonObject} = require("../../system/base_json");

const createTopic = async (req, res, next) => {

    // tạo đối tượng topic
    const topicModel = new TopicModel({
        content: req.body.content,
        idCauHoi: req.body.idCauHoi,
        createdAt: getNowFormatted(),
        createdBy: 12,
    });

    // lưu topic vào db
    return topicModel.save()
        .then((data) => {
            return res.status(200).json(JsonObject({
                code: 0,
                data: data
            }));
        })
        .catch((error) => {
            return res.status(200).json(JsonObject({
                code: 1,
                data: error
            }));
        });
};


const getAllTopic = async (req, res, next) => {
    //Lấy tất cả các chủ đề lấy các trường id content createdBy createdAt updatedAt updatedBy
    TopicModel.find()
        .select("id content createdBy createdAt updatedAt updatedBy")
        .then((data) => {
            data.forEach((element) => {
                element.createdAt = format(element.createdAt, datePattern);
                element.updatedAt = format(element.updatedAt, datePattern);
            })
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
                    code: 0,
                    data: error,
                })
            );
        });
};
/*
const getAllAnswers = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: get_all_answers.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
            );
    }
    var filter;
    if(req.query.idCauHoi){
        filter ={idCauHoi: req.query.idCauHoi};
    }
    // find all answers
    Answer.find(filter)
        .then((data) => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    data: baseJsonPage(0,0,data.length,data),
                })
            );
        })
        .catch((error) => {
            console.log(error);
        });
};
*/
const deleteTopic = async (req, res, next) => {
    let isExist = await verifyTopic(req, res);
    if (isExist) return;
    // Xóa topic bằng id
    TopicModel.deleteOne({id: req.body.id})
        .then(() => {
            return res.status(200).json(
                JsonObject({
                    code: 0,
                    data: {},
                })
            );
        })
        .catch((error) => {
            return res.status(status.success).json(
                JsonObject({
                    code: 0,
                    data: error,
                })
            );
        });
};

const verifyTopic = async (req, res) => {
    if (req.body.id === undefined) {
        res.status(200).json(
            JsonObject({
                code: 99,
                message: "id is required",
            })
        );
        return true;
    }
    let topic = await TopicModel.findOne({id: req.body.id});
    if (topic === null) {
        res.status(200).json(
            JsonObject({
                code: 99,
                message: "Chủ đề không tồn tại",
            })
        );
        return true;
    }
    return false;
}

const updateTopic = async (req, res) => {
    let isExist = await verifyTopic(req, res);
    if (isExist) return;

    //update topic
    TopicModel.updateOne({id: req.body.id},
        {
            $set: {
                content: req.body.content,
                idCauHoi: req.body.idCauHoi,
                updatedBy: 12,
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
                    code: 0,
                    data: error
                })
            );
        });
};


module.exports = {
    createTopic,
    getAllTopic,
    deleteTopic, updateTopic,
};
