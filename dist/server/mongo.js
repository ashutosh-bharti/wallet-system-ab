"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const setMongo = async () => {
    let mongodbURI;
    if (process.env.NODE_ENV !== 'test') {
        mongodbURI = process.env.MONGODB_URI;
    }
    await mongoose.connect(mongodbURI, {
        serverSelectionTimeoutMS: 5000
    }).catch(err => console.log(err.reason));
    console.log('Connected to MongoDB');
};
exports.default = setMongo;
//# sourceMappingURL=mongo.js.map