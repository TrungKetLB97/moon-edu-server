const {getNowFormatted, format, datePattern} = require("../../system/utils");
const TopicModel = require('../../model/topic_model')
const {JsonList} = require("../../system/base_json");
const {JsonObject} = require("../../system/base_json");

const createTopic = async (req, res, next) => {

    // tạo đối tượng topic
    const topicModel = new TopicModel({
        content: req.body.content,
        idCauHoi: req.body.idCauHoi,
        createdAt: Date(),
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
    //find answer by id
    TopicModel.find()
        .select("id content createdBy createdAt updatedAt updatedBy")
        .then((data) => {
            data.forEach((element) => {
                element.createdAt = format(element.createdAt, datePattern)
            })
            return res.status(200).json(
                JsonObject({
                    code: 0,
                    data: JsonList(1, 1, 2, data),
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

const deleteAnswer = async (req, res, next) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: delete_answer.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
            );
    }

    //delete answer by id
    Answer.deleteOne({ id: req.query.id })
        .then(() => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    message: "delete answer finish!",
                    data: req.query.id,
                })
            );
        })
        .catch((error) => {
            next(error);
        });
};

const updateAnswer = async (req, res) => {
    //check role
    var hasRole = await verifyRole(res, {
        roleId: update_answer.id,
        userId: req.user.id,
    });
    if (hasRole === false) {
        return res
            .status(status.success)
            .json(
                baseJson.baseJson({ code: 99, message: "Tài khoản không có quyền" })
            );
    }

    //update answer
    Answer.updateOne(
        //update by id
        { id: req.body.id },
        //set and update data
        {
            $set: {
                content: req.body.content,
                idCauHoi:req.body.idCauHoi,
                updatedBy: req.user.id,
                updatedAt: getNowFormatted(),
            },
        }
    )
        .then(() => {
            return res.status(status.success).json(
                baseJson.baseJson({
                    code: 0,
                    message: "update answer finish!",
                })
            );
        })
        .catch((error) => {
            console.log(error);
        });
};
*/

module.exports = {
    createTopic,
    getAllTopic,
    /*    getAllAnswers,
        deleteAnswer,
        updateAnswer,*/
};
