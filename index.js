const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require('cors');
const TopicRouter = require('./src/rest_controller/topic/topic_route');
const UserRouter = require('./src/rest_controller/user/user_route');
const VocabRouter = require('./src/rest_controller/vocabulary/vocabulary_route');
const HistoryRouter = require('./src/rest_controller/history/history_route');
const {showImage} = require('./src/system/module/file_utils');
const {format, datePattern} = require("./src/system/utils")

// Config thư viện đọc từ file .env
dotenv.config();

mongoose.Promise = global.Promise;

// Khai báo sử dụng express
const app = express();

// Sử dụng cors config cho web
app.use(cors());

//Config port
app.set("port", process.env.PORT || 3002);

// Sử dụng bodyparser để nhận object khi client push lên độ lớn của json push lên là 25mb
app.use(bodyParser.json({limit: '25mb'}));

app.use(bodyParser.urlencoded({extended: false, limit: '25mb'}));

// Khai báo link của mongodb
var db = process.env.URI_DB_PRODUCT;

// Connect đến với mongodb
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        // Thành công
        console.log("Database connected");
    })
    .catch((error) => {
        //Lỗi
        console.log(error);
        console.log("Error connecting to database");
    });

// Thực thi gọi đến domain để test server có hoạt động không
app.get("/", function (req, res) {

    res.send("Moon server");
});


app.use("/api/v1",
    TopicRouter,
    UserRouter,
    VocabRouter,
    HistoryRouter
);

app.get("/file-upload", showImage);

// online server
app.listen(app.get("port"), function () {
    console.log(format(Date.now(), datePattern));
    console.log("Listening on port " + app.get("port"));
    console.log(db);
});
