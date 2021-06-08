import * as fs from 'fs';
import { join } from 'path';
import * as bugs from './BUGSKit';

const testParseFile = (filepath: string) => {
	fs.readFile(filepath, 'utf8', (err, data) => {
		if (err) throw err;
		const fileContent = data.toLocaleString();
		const parseResult = bugs.parse(fileContent);
		if (parseResult.kind === 'error') {
			console.log('Parse Error', filepath)
			return;
		}
		const program = parseResult.content;
		function normalize(sourceCode: string): string {
			return sourceCode.replace(/[#][^\n]*/g, '').replace(/[\s;]/g, '')
		}
		const before = normalize(fileContent);
		const after = normalize(bugs.prettyPrint(program));
		if (before !== after) {
			console.log('Print Error: lost some info', filepath)
			let firstDiff = 0;
			while (before[firstDiff] === after[firstDiff]) {
				firstDiff++;
			}
			console.log("From", before.slice(firstDiff, firstDiff + 10))
			console.log("To  ", after.slice(firstDiff, firstDiff + 10))
			return;
		}
		return;
	})
}

const pathToTestPrograms = join(__dirname, '../testSuite');
fs.readdir(pathToTestPrograms, (err, files) => {
	if (err) throw err;
	for (const file of files) {
		if (file.endsWith('txt')) {
			testParseFile(join(pathToTestPrograms, file));
		}
	}
})
