"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new apollo_server_express_1.ValidationError("Invalid email format");
    }
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    if (password.length < 6) {
        throw new apollo_server_express_1.ValidationError("Password must be at least 6 characters long");
    }
};
exports.validatePassword = validatePassword;
