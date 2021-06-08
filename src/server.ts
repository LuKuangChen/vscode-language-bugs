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

function locateOpenBugsOnWindows(): string | null {
	const drives = ['c', 'd', 'e', 'f'];
	for (const drive of drives) {
		const openBugsPath = `${drive}:\\Program Files\\OpenBUGS`
		if (fs.existsSync(openBugsPath)) {
			const versions = fs.readdirSync(openBugsPath)
			for (const version of versions) {
				if (version.startsWith('OpenBUGS')) {
					return `${drive}:\\Program Files\\OpenBUGS\\${version}`
				}
			}
		}
	}
	return null
}

function execModelCheck(modelPath: string): string {
	// run OpenBUGS modelCheck depending on the os
	if (os.platform() === 'win32') {
		const scriptPath: string = tmp.fileSync().name;
		const logPath: string = tmp.fileSync().name;
		const scriptContent = [
			`modelDisplay('log')`,
			`modelCheck('${modelPath.replace('\\', '/')}')`,
			`modelSaveLog('${logPath.replace('\\', '/')}')`,
			`modelQuit("yes")`
		].join(os.EOL)
		fs.writeFileSync(scriptPath, scriptContent)
		const FULLPATH = locateOpenBugsOnWindows();
		if (FULLPATH === null) {
			return "Cannot find OpenBUGS installation error pos 0."
		}
		return `script: ${scriptContent}\ncommand: "${FULLPATH}\\OpenBUGS.exe" /PAR "${scriptPath.replace('\\', '/')}" /HEADLESS`;
		execSync(`"${FULLPATH}\\OpenBUGS.exe" /PAR "${scriptPath.replace('\\', '/')}" /HEADLESS`)
		return fs.readFileSync(logPath).toString()
	} else {
		return execSync(`echo 'modelCheck("${modelPath}")' | OpenBUGS`).toString()
	}
}

function modelCheck(textDocument: TextDocument): Diagnostic[] {
	const file = tmp.fileSync();
	const path = file.name
	fs.writeFileSync(path, textDocument.getText());
	let modelCheckResult;

	try {
		modelCheckResult = execModelCheck(path)
	} catch (err) {
		modelCheckResult = `Something went wrong when I tried to run modelCheck. The error is ${JSON.stringify(err)}. Please report to the extension author. error pos 0.`
	}
	// skip shit and newline
	if (modelCheckResult.startsWith("OpenBUGS version")) {
		modelCheckResult = modelCheckResult.split(os.EOL).slice(1).join(os.EOL)
	}
	const matchResult = /pos ([\d]+)/.exec(modelCheckResult)
	if (matchResult !== null) {
		const pos = textDocument.positionAt(parseInt(matchResult[1]))
		return [{
			'range': {
				'start': pos,
				'end': pos
			},
			'message': modelCheckResult,
			'source': 'OpenBUGS modelCheck(...)'
		}]
	} else {
		return []
	}
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const diagnostics: Diagnostic[] = [];
	const text = textDocument.getText();

	diagnostics.push(...modelCheck(textDocument))

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
