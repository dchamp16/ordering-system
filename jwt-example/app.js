"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
require("dotenv").config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
var JWT_SECRET = process.env.JWT;
console.log("JWT SECRET", JWT_SECRET);
