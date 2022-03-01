const express = require("express");
const verifyToken = require("../../system/midleware/auth_controller");
const {updateVocabulary} = require("./vocabulary_controller");
const {deleteVocabulary} = require("./vocabulary_controller");
const {getAllVocabulary} = require("./vocabulary_controller");
const {createVocabulary} = require("./vocabulary_controller");


const VocabRouter = express.Router();

VocabRouter.post("/vocabulary",verifyToken, createVocabulary);
VocabRouter.get("/vocabularies",verifyToken, getAllVocabulary);
VocabRouter.post("/vocabulary/remove",verifyToken, deleteVocabulary);
VocabRouter.post("/vocabulary/update",verifyToken, updateVocabulary);


module.exports = VocabRouter;
