import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Position
} from 'vscode-languageserver/node';
import * as bugs from './BUGSKit';
import * as tmp from 'tmp'
import * as path from 'path'
import * as os from 'os'
import {
	TextDocument, TextEdit
} from 'vscode-languageserver-textdocument';
import * as fs from 'fs';
import { exec, execSync } from 'child_process'
import { Seq } from './Seq';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			// completionProvider: {
			// 	resolveProvider: true
			// },
			// Tell the client that this server supports formatting.
			documentFormattingProvider: true,
			// Tell the client that this server supports going to definition.
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();
const documentContents: Map<string, bugs.Program> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});


function simpleDiagnositic(message: string): Diagnostic {
	return {
		'range': {
			'start': { 'line': 0, 'character': 0 },
			'end': { 'line': 0, 'character': 0 },
		},
		'message': `${message} Please report to the extension author.`,
		'source': 'OpenBUGS VSCode Extension Internal Error'
	}
}

function locateOpenBugsOnWindows(): string {
	const drives = ['c', 'd', 'e', 'f'];
	const programFiles = ['Program Files', 'Program Files (x86)']
	const installPaths = Seq.cartesianProduct(drives, programFiles).map(({ left: drive, right: programFiles }) => {
		return `${drive}:\\${programFiles}\\OpenBUGS`
	})
	// find path to OpenBUGS
	let path;
	// try {
		path = Seq.findFirst(installPaths, (path) => {
			return fs.existsSync(path)
		})
	// } catch (_) {
	// 	throw simpleDiagnositic(`I cannot find OpenBUGS installation in [${installPaths.join(', ')}].`)
	// }
	const versions = fs.readdirSync(path)
	for (const version of versions) {
		if (version.startsWith('OpenBUGS')) {
			return `${path}\\${version}\\OpenBUGS.exe`
		}
	}
}

function execModelCheckWin(modelPath: string): string {
	const FULLPATH = locateOpenBugsOnWindows();
	// const FULLPATH = `c:\\Program Files\\OpenBUGS\\OpenBUGS323`
	const scriptPath: string = tmp.fileSync().name;
	const logPath: string = tmp.fileSync().name;
	// const scriptPath: string = "c:\\Users\\user\\Desktop\\script.txt"
	// const logPath: string = "c:\\Users\\user\\Desktop\\log.txt";
	const winPathToOpenBubsPath = (path) => path.replace(/\\/g, '/');
	const scriptContent = [
		`modelDisplay('log')`,
		`modelCheck('${winPathToOpenBubsPath(modelPath)}')'`,
		`modelSaveLog('${winPathToOpenBubsPath(logPath)}')`,
		`modelQuit('yes')`
	].join(os.EOL)
	fs.writeFileSync(scriptPath, scriptContent)
	// const command = `'"${FULLPATH}" /PAR "${winPathToOpenBubsPath(scriptPath)}" /HEADLESS' | cmd`
	const command = `"${FULLPATH}" /PAR "${winPathToOpenBubsPath(scriptPath)}" /HEADLESS`
	return `script: ${scriptContent}\ncommand: ${command} error pos 0`;
	try {
		execSync(command, { 'timeout': 500, shell: 'cmd.exe' })
	} catch (e) {
		e.stdout = e.stdout.toString()
		e.stderr = e.stderr.toString()
		throw e;
	}
	return fs.readFileSync(logPath).toString()
}

function execModelCheck(modelPath: string): string {
	// run OpenBUGS modelCheck depending on the os
	if (os.platform() === 'win32') {
		return execModelCheckWin(modelPath)
	} else {
		return execSync(`echo 'modelCheck("${modelPath}")' | OpenBUGS`, { 'timeout': 300 }).toString()
	}
}

function diagnosticOfModelCheck(textDocument: TextDocument, modelCheckResult: string): Array<Diagnostic> {
	// skip shit and newline
	if (modelCheckResult.startsWith("OpenBUGS version")) {
		modelCheckResult = modelCheckResult.split(os.EOL).slice(1).join(os.EOL)
	}
	const matchResult = /error pos ([\d]+)/.exec(modelCheckResult)
	if (matchResult === null) {
		// the result looks good
		return []
	}
	const pos = textDocument.positionAt(parseInt(matchResult[1]))
	const message = modelCheckResult.replace(/error pos ([\d]+)/, '')
	return [{
		'range': {
			'start': pos,
			'end': pos
		},
		'message': message,
		'source': 'OpenBUGS modelCheck(...)'
	}]
}

function modelCheck(textDocument: TextDocument): Diagnostic[] {
		const file = tmp.fileSync();
		const path = file.name;
		fs.writeFileSync(path, textDocument.getText());
		let modelCheckResult = execModelCheck(path);
		return diagnosticOfModelCheck(textDocument, modelCheckResult)
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const diagnostics: Diagnostic[] = [];
	const text = textDocument.getText();

	try {
		diagnostics.push(...modelCheck(textDocument))
	} catch (e) {
		diagnostics.push(simpleDiagnositic(`Some unhandled error happens during modelCheck ${JSON.stringify(e)}`))
	}

	try {
		documentContents.delete(textDocument.uri);
		const parseResult = bugs.parse(text);
		if (parseResult.kind === 'error') {
			for (const err of parseResult.content) {
				const parseDiagnostic: Diagnostic = {
					severity: DiagnosticSeverity.Error,
					range: {
						start: err.position,
						end: err.position,
					},
					message: err.message,
					source: 'OpenBUGS VSCode Extension'
				};
				diagnostics.push(parseDiagnostic);
			}
		} else {
			documentContents.set(textDocument.uri, parseResult.content);
		}
	} catch (e) {
		diagnostics.push(simpleDiagnositic(`Some unhandled error happens during parsing ${JSON.stringify(e)}`))
	}

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

connection.onDocumentFormatting(
	(params, token, workDoneProgress, resultProgress) => {
		const { textDocument: { uri }, options } = params;
		const term = documentContents.get(uri);
		if (term) {
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
		} else {
			return [];
		}
	});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return [
			{
				label: 'TypeScript',
				kind: CompletionItemKind.Text,
				data: 1
			},
			{
				label: 'JavaScript',
				kind: CompletionItemKind.Text,
				data: 2
			}
		];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.detail = 'TypeScript details';
			item.documentation = 'TypeScript documentation';
		} else if (item.data === 2) {
			item.detail = 'JavaScript details';
			item.documentation = 'JavaScript documentation';
		}
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
