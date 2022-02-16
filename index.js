const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require('cors');


dotenv.config();

const app = express();
app.use(cors());


app.set("port", process.env.PORT || 3002);

app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '25mb'}));

var db = process.env.URI_DB_PRODUCT;

mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log(error);
        console.log("Error connecting to database");
    });

app.get("/", function(req, res) {

    res.send("Moon server");
});


// app.use(
//     "/api"
// );

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// });

app.listen(app.get("port"), function() {
    console.log(Date.now());
    console.log("Listening on port " + app.get("port"));
    console.log(db);

});