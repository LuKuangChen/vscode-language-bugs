import * as fs from 'fs';
import { join } from 'path';
import * as parse from '../parseBUGS';

let successCounter = 0;
let errorCounter = 0;

const testParseFile = (filepath: string) => {
	fs.readFile(filepath, 'utf8', (err, data) => {
		if (err) throw err;
		const fileContent = data.toLocaleString();
		const parseResult = parse.parse(fileContent);
		if (parseResult.errs.length === 0) {
			successCounter += 1;
		} else {
			errorCounter += 1;
			console.log("failed", errorCounter, successCounter, filepath)
			console.log(JSON.stringify(parseResult.errs, null, "  "))
		}
	})
}

const pathToTestPrograms = join(__dirname, '../../test programs/');
fs.readdir(pathToTestPrograms, (err, files) => {
	if (err) throw err;
	for (const file of files) {
		if (file.endsWith(".txt")) {
			testParseFile(join(pathToTestPrograms, file));
		}
	}
})
