const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {JsonObject} = require("../../system/base_json");
const UserModel = require("../../model/user_model");
const {JsonList} = require("../../system/base_json");
const {uploadImage} = require("../../system/module/file_utils");
const {parse, datePattern, getNowFormatted, format} = require("../../system/utils");

async function register(req, res) {

    const {userName, password} = req.body;
    // Kiểm tra điều kiện yêu cầu nhập username password
    if (password == null || userName == null) {
        return res
            .status(200)
            .json(JsonObject({code: 99, message: "Yêu cầu tài khoản và mật khẩu"}));
    }
    // endcode password
    let encodePassword = cryptPassword(password);

    // Kiểm tra user đã tồn tại chưa
    const oldUser = await UserModel.findOne({userName: userName});

    if (oldUser) {
        return res
            .status(200)
            .json(JsonObject({code: 99, message: "Tài khoản đã tồn tại"}));
    }

    // Nếu truyền lên avatar thì sẽ lưu lại ảnh và trả lại link ảnh
    let avatar = req.body.avatar;
    if (req.body.data != null && req.body.data !== '') {
        avatar = await uploadImage(req.body.data);
    }

    // Tạo đối tượng schema user
    const user = UserModel({
        name: req.body.name,
        birth: parse(req.body.birth, datePattern),
        avatar: avatar,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        address: req.body.address,
        userName: userName,
        permission: req.body.permission,// 1: admin || 0: user
        email: req.body.email,
        password: encodePassword,
        createdAt: getNowFormatted()
    });

    // Tạo mới token xác thực người dùng
    user.token = jwt.sign(
        {user_id: user._id}, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_LIFE}
    );
    // Lưu user vào trong database
    user.save().then((data) => {
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

// endcode password
function cryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10, 'b'));
}

// Kiểm tra password
function comparePassword(plainPass, hashword) {
    return bcrypt.compareSync(plainPass, hashword);
}

async function login(req, res) {

    // Get user input
    const userName = req.body.userName;
    const password = req.body.password;
    // Kiểm tra nhập đủ username password
    if (password == null || userName == null) {
        return res.status(200).json(JsonObject({code: 99}));
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const user = await UserModel.findOne({userName: userName});

    if (!user) return res.status(200).json(JsonObject({code: 99, message: "Sai tài khoản hoặc mật khẩu"}));

    // Kiểm tra tài khoản mật khẩu có dúng không
    if (!comparePassword(password, user.password)) {
        return res.status(200).json(JsonObject({code: 99, message: "Sai tài khoản hoặc mật khẩu"}));
    }

    // Tạo mới token xác thực người dùng
    user.token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });

    // Format lại thời gian
    user.birth = format(user.birth, datePattern);
    user.createdAt = format(user.createdAt, datePattern);
    user.updatedAt = format(user.updatedAt, datePattern);

    // lưu lại fcmtoken của firebase nếu có, phục vụ push notification
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
    // Tìm user theo token
    let user = await UserModel.findOne({id: req.user.id})

    if (user == null)
        return res.status(200).json(JsonObject({code: 99, message: "Tài khoản chưa được đăng ký"}));
    // Format lại thời gian
    user.birth = format(user.birth, datePattern);
    user.createdAt = format(user.createdAt, datePattern);
    user.updatedAt = format(user.updatedAt, datePattern);

    return res.status(200).json(JsonObject({code: 0, data: user}));


}

async function getListUser(req, res) {
    let filter = {};
    // filter theo tên user
    if (req.query.name) {
        filter['name'] = {"$regex": req.query.name, "$options": "i"}
    }
    if (req.query.userName) {
        filter['userName'] = {"$regex": req.query.userName, "$options": "i"}
    }
    // Tìm user rồi trả ra
    UserModel.find(filter).then((data) => {
        data.forEach((element) => {
            element.birth = format(element.birth, datePattern);
            element.createdAt = format(element.createdAt, datePattern);
            element.updatedAt = format(element.updatedAt, datePattern);
        })
        return res.status(200).json(JsonObject({code: 0, data: JsonList(0, 0, data.length, data)}));

    }).catch((error) => {
        return res.status(200).json(JsonObject({code: 99, data: error}))
    });

}

async function deleteUser(req, res) {
    // Xóa người dùng theo id
    UserModel.deleteOne({id: req.body.id})
        .then((result) => {
            return res.status(200).json(JsonObject({code: 0, data: {}}));
        }).catch((error) => {
        return res.status(200).json(JsonObject({code: 99, data: error}));
    });
}

async function updateUser(req, res) {
    let user = await UserModel.findOne({"userName": req.body.userName,});
    if (user) {
        if (user.id !== req.body.id) {
            return res.status(200).json(JsonObject({code: 99, message: 'Tên tài khoản đã tồn tại'}));

        }

    }
    // Lấy link ảnh theo client hoặc ảnh mới
    let image = req.body.avatar ?? '';
    if (req.body.data != null && req.body.data !== '') {
        image = await uploadImage(req.body.data);
    }
    // Cập nhật user rồi trả về kết quả
    UserModel.updateOne({id: req.body.id}, {
        $set: {
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            gender: req.body.gender,
            address: req.body.address,
            avatar: image,
            permission: req.body.permission,
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

    // Tìm người dùng trong db theo token
    let user = await UserModel.findOne({id: req.user.id});

    if (user == null)
        return res.status(200).json(JsonObject({code: 99, message: "Người dùng không tồn tại"}));

    // Kiểm tra mật khẩu cũ nhập có đúng không
    if (!comparePassword(req.body.oldPassword, user.password)) {
        return res.status(200).json(JsonObject({code: 99, message: "Sai mật khẩu cũ"}));
    }

    // encode new password
    let encodePassword = cryptPassword(req.body.newPassword);

    // Update password người dùng
    UserModel.updateOne({id: req.user.id},
        {$set: {password: encodePassword}})
        .then((result) => {
            return res.status(200).json(JsonObject({code: 0, data: result}));
        })
        .catch((error) => {
            return res.status(200).json(baseJson({code: 99, data: error}));
        });


}

async function resetPassword(req, res) {
    // encode new password
    let encodePassword = cryptPassword('123@123a');
    // Reset password người dùng về mật khẩu mặc định
    return UserModel.updateOne(
        {id: req.body.id},
        {$set: {password: encodePassword}})
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