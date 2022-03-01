const {getNowFormatted, format, datePattern} = require("../../system/utils");
const {uploadImage} = require("../../system/module/file_utils");
const TopicModel = require('../../model/topic_model')
const VocabularyModel = require('../../model/vocabulary')
const {JsonList} = require("../../system/base_json");
const {JsonObject} = require("../../system/base_json");

const createVocabulary = async (req, res) => {
    if (!validate(req, res)) {
        return;
    }
    // tạo đối tượng vocabulary
    const vocabModel = new VocabularyModel({
        vietnamese: req.body.vietnamese,
        english: req.body.english,
        pronunce: req.body.pronunce,
        vocabType: req.body.vocabType,
        createdAt: getNowFormatted(),
        createdBy: req.user.id,
    });

    // lưu vocabulary vào db
    return vocabModel.save()
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

    if (!req.body.english) {
        res.status(200).json(JsonObject({
            code: 1, message: 'english is required'
        }))
        return false;
    }
    if (!req.body.vietnamese) {
        res.status(200).json(JsonObject({
            code: 1, message: 'vietnamese is required'
        }));
        return false;

    }
    if (!req.body.pronunce) {
        res.status(200).json(JsonObject({
            code: 1, message: 'pronunce is required'
        }));
        return false;

    }

    if (!"public | private".includes(req.body.vocabType)) {

        res.status(200).json(JsonObject({
            code: 1, message: 'vocabType must equal \"public\" or \"private\"'
        }));
        return false;

    }
    return true;

}

const getAllVocabulary = async (req, res) => {

    let filter = {};
    if (req.query.vocabType === 'private') {
        filter['createdBy'] = req.user.id;
    }
    if (req.query.vocabType) {
        filter['vocabType'] = req.query.vocabType;
    }
    if (req.query.vietnamese) {
        filter['vietnamese'] = req.query.vietnamese;
    }
    if (req.query.english) {
        filter['english'] = req.query.english;
    }
    //Lấy tất cả các chủ đề lấy các trường id content createdBy createdAt updatedAt updatedBy
    VocabularyModel.find(filter)
        .select("id vocabType vietnamese enable english vocabType createdBy createdAt updatedAt updatedBy")
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

const deleteVocabulary = async (req, res) => {
    //Kiểm tra xem từ vựng đó có tồn tại hay không
    let isExist = await verifyVocab(req, res);
    if (isExist) return;
    // Xóa topic bằng id
    VocabularyModel.deleteOne({id: req.body.id})
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

const verifyVocab = async (req, res) => {
    if (req.body.id === undefined) {
        res.status(200).json(
            JsonObject({
                code: 99,
                message: "id is required",
            })
        );
        return true;
    }
    let topic = await VocabularyModel.findOne({id: req.body.id});
    if (topic === null) {
        res.status(200).json(
            JsonObject({
                code: 99,
                message: "Từ vựng không tồn tại",
            })
        );
        return true;
    }
    return false;
}

const updateVocabulary = async (req, res) => {
    if (!validate(req, res)) {
        return;
    }
    let isExist = await verifyVocab(req, res);
    if (isExist) return;

    // Cập nhật lại từ vựng
    VocabularyModel.updateOne({id: req.body.id},
        {
            $set: {
                vietnamese: req.body.vietnamese,
                english: req.body.english,
                pronunce: req.body.pronunce,
                vocabType: req.body.vocabType,
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
    createVocabulary,
    getAllVocabulary,
    deleteVocabulary,
    updateVocabulary,
};
