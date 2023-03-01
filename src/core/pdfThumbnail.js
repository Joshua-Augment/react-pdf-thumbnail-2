"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createThumbImage_1 = require("./createThumbImage");
const readPdf_1 = __importDefault(require("./readPdf"));
const pdfThumbnail = (data, config) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const file = Array.isArray(data) ? data[0] : data;
        const arrBuffer = yield file.arrayBuffer();
        const isVideo = config.fileName === undefined;
        const { fileName, extension } = (0, createThumbImage_1.getExtension)((_a = config.fileName) !== null && _a !== void 0 ? _a : file.name, isVideo);
        const newFileName = `${fileName}.${extension}`;
        if (/(pdf|zip|doc)$/gi.test(extension)) {
            try {
                resolve((0, readPdf_1.default)(arrBuffer, config));
            }
            catch (err) {
                reject({ error: true, errorDetails: err });
            }
        }
        else {
            reject({
                error: true,
                errorDetails: {
                    wrongFile: true,
                    message: 'File type is not pdf',
                },
            });
        }
    }));
};
exports.default = pdfThumbnail;
