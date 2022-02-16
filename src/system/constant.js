module.exports.getAutoIncrement = function (nameCollection) {
    return {
        model: "topics", // Tên bảng muốn áp dụng tự tăng
        field: "id", // Trường muốn tăng
        startAt: 1, // Bắt đầu từ
        incrementBy: 1, // Giá trị tăng sau mỗi lần insert
    };
}




