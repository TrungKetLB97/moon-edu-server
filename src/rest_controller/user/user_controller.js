const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {JsonObject} = require("../../system/base_json");
const UserModel = require("../../model/user_model");
const {JsonList} = require("../../system/base_json");
const {uploadImage} = require("../../system/module/file_utils");
const {parse, datePattern, getNowFormatted,format} = require("../../system/utils");

async function register(req, res) {

    const {userName, password} = req.body;

    if (password == null || userName == null) {
        return res
            .status(200)
            .json(JsonObject({code: 99, message: "Yêu cầu tài khoản và mật khẩu"}));
    }

    const oldUser = await UserModel.findOne({userName: userName});

    if (oldUser) {
        return res
            .status(200)
            .json(JsonObject({code: 99, message: "Tài khoản đã tồn tại"}));
    }
    let encodePassword;

    cryptPassword(password, (err, hash) => {
        encodePassword = hash;
    });


    let avatar = req.body.avatar;
    if (req.body.data != null && req.body.data !== '') {
        avatar = await uploadImage(req.body.data);
    }
    const user = UserModel({
        name: req.body.name,
        birth: parse(req.body.birth, datePattern),
        avatar: avatar,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        address: req.body.address,
        userName: userName,
        email: req.body.email,
        password: encodePassword,
        createdAt: getNowFormatted()
    });

    user.token = jwt.sign(
        {user_id: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
        }
    );
    await user.save().then((data) => {
        return res.status(200).json(
            JsonObject({
                code: 0,
                data: data
            })
        );
    }).catch((error) => res.status(200).json(
        JsonObject({
            code: 99,
            data: error
        }))
    );


}

function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });
    });
}

function comparePassword(plainPass, hashword, callback) {
    bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
}

async function login(req, res) {

    // Get user input
    const userName = req.body.userName;
    const password = req.body.password;
    // Validate user input
    if (!(userName && password)) {
        return res.status(200).json(JsonObject({code: 99}));
    }

    // Validate if user exist in our database
    const user = await UserModel.findOne({userName: userName});
    if (user == null) return res.status(200).json(JsonObject({code: 99, message: "Sai tài khoản hoặc mật khẩu"}));


    comparePassword(password, user.password, (error, isMatch) => {
        if (!isMatch) return res.status(200).json(JsonObject({code: 99, message: "Sai tài khoản hoặc mật khẩu"}));
    })
    // Create token
    user.token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    if (req.body.fcmToken) {
        await UserModel.updateOne({userName: userName}, {
            $set: {
                fcmToken: req.body.fcmToken
            }
        });
    }
    return res.status(200).json(JsonObject({code: 0, data: user}));

}

async function getUserInfo(req, res) {

    let user = await UserModel.findOne({id: req.user.id})

    if (user == null)
        return res.status(200).json(JsonObject({code: 99, message: "Tài khoản chưa được đăng ký"}));

    return res.status(200).json(JsonObject({code: 0, data: user}));


}

async function getListUser(req, res) {
    let filter = {};

    if (req.query.name) {
        filter['name'] = {"$regex": req.query.name, "$options": "i"}
    }

    UserModel.find(filter).then((data) => {
        data.forEach((element) => {
            element.birth = format(element.birth,datePattern);
            element.createdAt = format(element.createdAt,datePattern);
            element.updatedAt = format(element.updatedAt,datePattern);
        })
        return res.status(200).json(JsonObject({code: 0, data: JsonList(0, 0, data.length, data)}));

    }).catch((error) => {
        return res.status(200).json(JsonObject({code: 99, data: error}))
    });

}

async function deleteUser(req, res) {

    UserModel.deleteOne({id: req.body.id})
        .then((result) => {
            return res.status(200).json(JsonObject({code: 0, data: {}}));
        }).catch((error) => {
        return res.status(200).json(JsonObject({code: 99, data: error}));
    });
}

async function updateUser(req, res) {
    let image = req.body.avatar ?? '';
    if (req.body.data != null && req.body.data !== '') {
        image = await uploadImage(req.body.data);
    }

    UserModel.updateOne({id: req.body.id}, {
        $set: {
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            gender: req.body.gender,
            address: req.body.address,
            avatar: image,
            birth: parse(req.body.birth, datePattern),
            phoneNumber: req.body.phoneNumber,
            updatedAt: getNowFormatted()
        }
    })
        .then((result) => {
            return res.status(200).json(JsonObject({code: 0, data: result}));
        })
        .catch((error) => {
            return res.status(200).json(JsonObject({code: 99, data: error}));
        });
}

async function changePassword(req, res) {

    let user = await UserModel.findOne({id: req.user.id});
    if (user == null)
        return res.status(200).json(JsonObject({code: 99, message: "Người dùng không tồn tại"}));

    comparePassword(req.body.oldPassword, user.password, (err, isMatch) => {
        if (isMatch) {
            cryptPassword(req.body.newPassword, (err, hash) => {
                UserModel.updateOne({id: req.user.id},
                    {$set: {password: hash}})
                    .then((result) => {
                        return res.status(200).json(JsonObject({code: 0, data: result}));
                    })
                    .catch((error) => {
                        return res.status(200).json(baseJson({code: 99, data: error}));
                    });
            });
        }
        return res.status(200).json(baseJson({code: 99, message: "Sai mật khẩu cũ"}));
    })


}

async function resetPassword(req, res) {

    return UserModel.updateOne(
        {id: req.body.id},
        {$set: {password: '123@123a'}})
        .then((result) => {
            return res.status(200).json(JsonObject({code: 0, data: result}));
        })
        .catch((error) => {
            return res.status(200).json(JsonObject({code: 99, data: error}));
        });

}

module.exports = {
    register,
    getUserInfo,
    login,
    deleteUser,
    updateUser,
    changePassword,
    getListUser,
    resetPassword
};