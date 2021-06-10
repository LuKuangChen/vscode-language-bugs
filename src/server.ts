import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	TextDocumentSyncKind,
	InitializeResult,
} from 'vscode-languageserver/node';
import * as bugs from './BUGSKit';
import * as tmp from 'tmp'
import * as path from 'path'
import * as os from 'os'
import {
	TextDocument, TextEdit
} from 'vscode-languageserver-textdocument';
import * as fs from 'fs';
import { execSync } from 'child_process'
import { Seq } from './Seq';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// parsed prgrams
const documentContents: Map<string, bugs.Program> = new Map();
let pathToOpenBUGS: string | undefined = undefined;
let pathToStorage: string | undefined = undefined;

// connection.onNotification('custom/setStoragePath', (path) => {
// })

connection.onInitialize((_params: InitializeParams) => {
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			documentFormattingProvider: true,
		}
	};
	return result;
});

async function initializePathToStorage(): Promise<void> {
	return connection.sendRequest('custom/getStoragePath').then((path: string) => {
		pathToStorage = path;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path)
		}
	})
}

connection.onInitialized((_params) => {
	if (os.platform() === 'win32') {
		const drives = ['c', 'd', 'e', 'f'];
		const programFiles = ['Program Files', 'Program Files (x86)']
		const possiblePaths = Seq.cartesianProduct(drives, programFiles).
			map(({ left: drive, right: programFiles }) => {
				return `${drive}:\\${programFiles}\\OpenBUGS`
			})
		const installedPaths = possiblePaths.
			filter((path) => fs.existsSync(path)).
			flatMap((path) => {
				return fs.readdirSync(path).
					filter((version) => {
						return version.startsWith('OpenBUGS')
					}).
					map((version) => {
						return `${path}\\${version}\\OpenBUGS.exe`
					})
			});
		if (installedPaths.length === 0) {
			connection.sendNotification("custom/warning", `I find no OpenBUGS installation in ${possiblePaths.join(', ')}.`)
			return
		} else if (installedPaths.length > 1) {
			connection.sendNotification("custom/warning", `I am not sure which OpenBUGS should I use. There are more than one installations: ${installedPaths.join(', ')}.`)
			return
		} else {
			pathToOpenBUGS = installedPaths[0]
			return
		}
	} else if (os.platform() === 'linux') {
		pathToOpenBUGS = 'OpenBUGS'
		return
	} else {
		connection.sendNotification('custom/warning', `Sorry, your OS (${os.platform()}) is not supported yet.`)
		return
	}
})

documents.onDidChangeContent(change => {
	handleDidChangeContent(change.document);
});

documents.onDidOpen(event => {
	handleDidSave(event.document)
})

documents.onDidSave(event => {
	handleDidSave(event.document);
})

async function handleDidChangeContent(textDocument: TextDocument): Promise<void> {
	if (pathToStorage === undefined) {
		initializePathToStorage().then(() => handleDidChangeContent(textDocument))
	} else {
		try {
			connection.sendDiagnostics({
				uri: textDocument.uri,
				diagnostics: [
					// ...modelCheck(textDocument),
					...parseAndCheck(textDocument)
				]
			})
			return
		} catch (e) {
			connection.sendNotification('custom/warning', `Found an internal error. Please report to the auther of OpenBUGS VSCode extension. The error is ${JSON.stringify(e)}`)
		}
	}
}

async function handleDidSave(textDocument: TextDocument): Promise<void> {
	if (pathToStorage === undefined) {
		initializePathToStorage().then(() => handleDidSave(textDocument))
	} else {
		try {
			connection.sendDiagnostics({
				uri: textDocument.uri,
				diagnostics: [
					...modelCheck(textDocument),
					...parseAndCheck(textDocument)
				]
			})
			return
		} catch (e) {
			connection.sendNotification('custom/warning', `Found an internal error. Please report to the auther of OpenBUGS VSCode extension. The error is ${JSON.stringify(e)}`)
		}
	}
}

let freshCounter = 0;
function freshPath(suffix: string = '.txt') {
	if (pathToStorage !== undefined) {
		freshCounter++;
		return path.join(pathToStorage, `${freshCounter}-${suffix}`)
	} else {
		throw 'storage path is not defined yet.'
	}
}

function execModelCheckWin(modelPath: string): string {
	const scriptPath: string = freshPath('script.txt');
	const logPath: string = freshPath('log.txt');
	const winPathToOpenBubsPath = (path) => path.replace(/\\/g, '/');
	const scriptContent = [
		`modelDisplay('log')`,
		`modelCheck('${winPathToOpenBubsPath(modelPath)}')`,
		`modelSaveLog('${winPathToOpenBubsPath(logPath)}')`,
		`modelQuit('yes')`
	].join(os.EOL)
	fs.writeFileSync(scriptPath, scriptContent)
	const command = `"${pathToOpenBUGS}" /PAR "${winPathToOpenBubsPath(scriptPath)}" /HEADLESS`
	execSync(command, { shell: 'cmd.exe' })
	const result = fs.readFileSync(logPath).toString();
	fs.unlinkSync(scriptPath);
	fs.unlinkSync(logPath);
	return result
}

function execModelCheck(textDocument: TextDocument): string {
	const modelPath = freshPath('model.txt');
	fs.writeFileSync(modelPath, textDocument.getText());
	let result: string;
	if (os.platform() === 'win32') {
		result = execModelCheckWin(modelPath)
	} else {
		result = execSync(`echo 'modelCheck("${modelPath}")' | OpenBUGS`, { 'timeout': 300 }).toString()
	}
	fs.unlinkSync(modelPath);
	return result
}

function modelCheck(textDocument: TextDocument): Diagnostic[] {
	function diagnosticOfLog(textDocument: TextDocument, log: string): Array<Diagnostic> {
		// skip shit and newline
		if (log.startsWith("OpenBUGS version")) {
			log = log.split(os.EOL).slice(1).join(os.EOL)
		}
		const matchPos = /error pos ([\d]+)/.exec(log)
		const matchLine =  /on line ([\d]+)/.exec(log)
		if (matchPos === null || matchLine === null) {
			connection.sendNotification('custom/information', log)
			return []
		} else {
			const pos = textDocument.positionAt(parseInt(matchPos[1]))
			pos.line = parseInt(matchLine[1]) - 1
			const message = log
			return [{
				'range': {
					'start': pos,
					'end': pos
				},
				'message': message,
				'source': 'OpenBUGS modelCheck'
			}]
		}
	}

	let LogOfOpenBUGS = execModelCheck(textDocument);
	return diagnosticOfLog(textDocument, LogOfOpenBUGS)
}

function parseAndCheck(textDocument: TextDocument): Array<Diagnostic> {
	const text = textDocument.getText();
	documentContents.delete(textDocument.uri);
	const parseResult = bugs.parse(text);
	if (parseResult.kind === 'error') {
		return parseResult.content.map((err) => {
			return {
				severity: DiagnosticSeverity.Error,
				range: {
					start: err.position,
					end: err.position,
				},
				message: err.message,
				source: 'Reported by OpenBUGS Extension'
			};
		})
	} else {
		documentContents.set(textDocument.uri, parseResult.content);
		return [];
	}
}

connection.onDocumentFormatting(
	(params, token, workDoneProgress, resultProgress) => {
		const { textDocument: { uri }, options } = params;
		const term = documentContents.get(uri);
		if (term === undefined) {
			connection.sendNotification('custom/information', 'Please fix grammar errors before formatting.')
			return []
		} else {
			const formattedText = bugs.prettyPrint(term);
			const result: TextEdit[] = [];
			result.push({
				range: {
					start: { line: 0, character: 0 },
					end: { line: Number.MAX_VALUE, character: Number.MAX_VALUE }
				},
				newText: formattedText || ""
			});
			return result;
		}
	});

documents.listen(connection);
connection.listen();
