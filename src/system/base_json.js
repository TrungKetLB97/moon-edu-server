const { getNowFormatted } = require("./utils");

// basic json khi trả về
module.exports.JsonObject = function ({ code, message, data }) {
	return {
		time: getNowFormatted(),
		error: JsonError({ code: code, message: message }),
		data: data ?? {},
	};
};

// json error trả về
function JsonError({ code, message }) {
	return {
		code: code,
		message: message ?? (code === 0 ? "Success" : "Error"),
	};
}

// json phân trang
module.exports.JsonList = function (index, size, total, data) {
	return {
		pageIndex: index,
		pageSize: size,
		totalPage: Math.ceil(total / size < 1 ? 1 : total / size),
		recordTotal: total,
		data: data,
	};
};
