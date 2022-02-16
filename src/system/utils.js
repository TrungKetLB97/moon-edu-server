const moment = require('moment');

const datePattern = "DD/MM/yyyy HH:mm:ss";

// Lấy thời gian hiện tại theo format yyyy/MM/DD HH:mm:ss
function getNowFormatted() {
    return moment();
}

// Chuyển từ date sang string
function format(date,to) {
    return moment(date).format(to);
}

// chuyển từ string sang date
function parse(data, from) {
    return moment(data, from);
}

async function verifyRole(res, {userId, roleId}) {
    let userRole = await userRoleModel.find({idUser: userId});
    for (var i = 0; i < userRole.length; i++) {
        if (userRole[i].idRole === roleId) {
            return true;
        }
    }
    return true;
}

module.exports = {
    getNowFormatted,
    verifyRole,
    format,
    parse,
    datePattern
};
