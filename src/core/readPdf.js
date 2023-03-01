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
Object.defineProperty(exports, "__esModule", { value: true });
const createThumbImage_1 = require("./createThumbImage");
const pdfjsDist = require("pdfjs-dist");
const readPdf = (pdf, config) => {
    pdfjsDist.getDocument(pdf).promise.then((doc) => {
        const pages = [];
        if (config.pages) {
            if (Array.isArray(config.pages)) {
                pages.push(...config.pages);
            }
            else {
                switch (typeof config.pages) {
                    case "number":
                        pages.push(config.pages);
                        break;
                    case "string":
                        const csv = config.pages.split(',');
                        csv.map(_csv => {
                            const ranged = _csv.split("-");
                            if (ranged.length > 1) {
                                for (let i = Number(ranged[0]); i <= Number(ranged[1]); i++) {
                                    pages.push(i);
                                }
                            }
                            else {
                                pages.push(Number(ranged[0]));
                            }
                        });
                        break;
                }
            }
        }
        while (pages.length < doc.numPages)
            pages.push(pages.length + 1);
        return Promise.all(pages.map((num) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const page = yield doc.getPage(num);
                (0, createThumbImage_1.createCanvas)(page, config).then((canvas) => {
                    var _a;
                    console.log(canvas);
                    return (0, createThumbImage_1.createImage)(canvas, (_a = config.name) !== null && _a !== void 0 ? _a : 'output-image.jpg');
                });
            }
            catch (err) {
                return [false, err];
            }
        })));
    });
};
exports.default = readPdf;
