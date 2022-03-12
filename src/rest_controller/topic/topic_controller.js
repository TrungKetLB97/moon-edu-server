const {getNowFormatted, format, datePattern} = require("../../system/utils");
const {uploadImage} = require("../../system/module/file_utils");
const TopicModel = require('../../model/topic_model')
const {JsonList} = require("../../system/base_json");
const {JsonObject} = require("../../system/base_json");

const createTopic = async (req, res) => {
    if (!validate(req, res)) {
        return;
    }

    let path = req.body.image;
    if (req.body.data != null && req.body.data !== '') {
        path = await uploadImage(req.body.data);
    }

    // tạo đối tượng topic
    const topicModel = new TopicModel({
        name: req.body.name,
        topicType: req.body.topicType,
        description: req.body.description,
        enable: req.body.enable,
        image: path,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    // lưu topic vào db
    return topicModel.save()
        .then((data) => {
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

function validate(req, res) {

    if (!req.body.name) {
        res.status(200).json(JsonObject({
            code: 1, message: 'name is required'
        }))
        return false;
    }
    if (!req.body.topicType) {
        res.status(200).json(JsonObject({
            code: 1, message: 'topicType is required'
        }));
        return false;

    }
    if (!"public | private".includes(req.body.topicType)) {

        res.status(200).json(JsonObject({
            code: 1, message: 'topicType must equal \"public\" or \"private\"'
        }));
        return false;

    }
    return true;

}

const getAllTopic = async (req, res) => {

    if (!req.query.topicType) {
        return res.status(200).json(
            JsonObject({
                code: 1,
                message: 'topicType is required',
            })
        );
    }
    let filter = {};
    if (req.query.topicType === 'private') {
        filter['createdBy'] = req.user.id;
    }
    if (req.query.topicType) {
        filter['topicType'] = req.query.topicType;
    }
    if (req.query.name) {
        filter['name'] = {"$regex": req.query.name, "$options": "i"}
    }
    if (req.query.enable) {
        filter['enable'] = req.query.enable;
    }
    //Lấy tất cả các chủ đề lấy các trường id content createdBy createdAt updatedAt updatedBy
    TopicModel.find(filter)
        .select("id name description enable image topicType createdBy createdAt updatedAt updatedBy")
        .then((data) => {
            data.forEach((element) => {
                // format lại thời gian về kiểu dd/mm/yyyy hh:mm:ss
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
                    code: 99,
                    data: error,
                })
            );
        });
};

const deleteTopic = async (req, res) => {
    //Kiểm tra xem topic đó có tồn tại hay không
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
                    code: 99,
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
    if (!validate(req, res)) {
        return;
    }
    let isExist = await verifyTopic(req, res);
    if (isExist) return;

    let path = req.body.image;
    if (req.body.data != null && req.body.data !== '') {
        path = await uploadImage(req.body.data);
    }
    // Cập nhật lại topic
    TopicModel.updateOne({id: req.body.id},
        {
            $set: {
                name: req.body.name,
                topicType: req.body.topicType,
                description: req.body.description,
                enable: req.body.enable,
                image: path,
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
    createTopic,
    getAllTopic,
    deleteTopic, updateTopic,
};
