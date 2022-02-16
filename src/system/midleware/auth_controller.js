const jwt = require("jsonwebtoken");
const {JsonObject} = require("../base_json");

const config = process.env;

const verifyToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["token"];

	if (!token) {
		return res.status(403).json(
			JsonObject({
				code: 99,
				message: "Truy cập bị cấm",
			})
		);
	}
	try {
		const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
		req.user = decoded;
	} catch (err) {
		return res.status(403).json(JsonObject({ code: 99, message: "Truy cập bị cấm"}));
	}
	return next();
};



module.exports = verifyToken;
