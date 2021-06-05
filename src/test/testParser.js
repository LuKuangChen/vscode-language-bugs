"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const parse = require("../parseBUGS");
let successCounter = 0;
let errorCounter = 0;
const testParseFile = (filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err)
            throw err;
        const fileContent = data.toLocaleString();
        const parseResult = parse.parse(fileContent);
        if (parseResult.errs.length === 0) {
            successCounter += 1;
        }
        else {
            errorCounter += 1;
            console.log("failed", errorCounter, successCounter, filepath);
            console.log(JSON.stringify(parseResult.errs, null, "  "));
        }
    });
};
const pathToTestPrograms = path_1.join(__dirname, '../../test programs/');
fs.readdir(pathToTestPrograms, (err, files) => {
    if (err)
        throw err;
    for (const file of files) {
        if (file.endsWith(".txt")) {
            testParseFile(path_1.join(pathToTestPrograms, file));
        }
    }
});
