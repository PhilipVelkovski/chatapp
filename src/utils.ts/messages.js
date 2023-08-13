"use strict";
/**
 * Project utilitys.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLocationMesssage = exports.generateMessage = void 0;
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};
exports.generateMessage = generateMessage;
const generateLocationMesssage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
};
exports.generateLocationMesssage = generateLocationMesssage;
