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
function parse(data, to) {
    return moment(data, to);
}

function getMoreFormatted(more) {
    return moment().subtract(-more, "minutes").format('yyyy/MM/DD HH:mm:ss');
}

function afterNow(date1) {
    return !moment(date1, 'yyyy/MM/DD HH:mm:ss').isAfter(moment());
}

function getMoreTime(more) {
    var datetime = new Date();
    var dateString = new Date(
        datetime.getTime() - datetime.getTimezoneOffset() * 60000 + more * 60000
    );

    return dateString.toISOString().replace("T", " ").substr(0, 19);
}

function convertDateTime(date) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return dateString.toISOString().replace("T", " ").substr(0, 19);
}

function getNowMilliseconds() {
    return Number(Date.now());
}

async function verifyRole(res, {userId, roleId}) {
    var userRole = await userRoleModel.find({idUser: userId});
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
    convertDateTime,
    getMoreTime,
    getNowMilliseconds,
    getMoreFormatted,
    afterNow,
    format,
    parse,
    datePattern
};
