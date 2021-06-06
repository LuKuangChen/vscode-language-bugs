import * as fs from 'fs';
import { join } from 'path';
import * as bugs from '../../server/src/BUGSKit';

let errorCounter = 0;

const testParseFile = (filepath: string) => {
	fs.readFile(filepath, 'utf8', (err, data) => {
		if (err) throw err;
		const fileContent = data.toLocaleString();
		const parseResult = bugs.parse(fileContent);
		if (parseResult.kind === 'error') {
			errorCounter += 1;
			console.log('Parse Error', filepath)
			return;
		}
		const program = parseResult.content;
		function normalize(sourceCode: string): string {
			return sourceCode.replace(/[\s;]/g, '')
		}
		const before = normalize(fileContent);
		try {
			const after = normalize(bugs.prettyPrint(program));
			if (before !== after) {
				console.log('Print Error: lost some info', filepath)
				return;
			}
			// console.log('Passed.')
			return;
		} catch (_) {
			console.log('Oops', filepath)
			console.log(JSON.stringify(program))
		}
	})
}

const pathToTestPrograms = join(__dirname, '../../test programs/');
fs.readdir(pathToTestPrograms, (err, files) => {
	if (err) throw err;
	for (const file of files) {
		testParseFile(join(pathToTestPrograms, file));
	}
})
