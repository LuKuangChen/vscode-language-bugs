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
import * as bugs from './BUGSKits';
import * as PP from './prettyPrinter';
import {
	TextDocument, TextEdit
} from 'vscode-languageserver-textdocument';

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

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const diagnostics: Diagnostic[] = [];
	const text = textDocument.getText();

	documentContents.delete(textDocument.uri);
	const parseResult = bugs.parse(text);
	if (parseResult.kind === 'error') {
		const parseDiagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: parseResult.content,
				end: parseResult.content
			},
			message: "parse error",
			source: 'parser'
		};
		diagnostics.push(parseDiagnostic);
	} else {
		documentContents.set(textDocument.uri, parseResult.content);
	}
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

function intersperse<A>(a: A, as: Array<A>): Array<A> {
	if (as.length === 0) {
		return as;
	} else {
		const bs: Array<A> = [];
		bs.push(as[0]);
		for (let i = 0; i < as.length; i++) {
			bs.push(a);
			bs.push(as[i]);
		}
		return bs;
	}
}

function prettyPrint(p: bugs.Program): string {
	return "";
	function pName(name: bugs.Name): PP.Doc {
		return PP.text(name.literal);
	}
	function pExp(exp: bugs.Expression): PP.Doc {
		if (exp.kind === 'variable') {
			return pName(exp.name);
		} else if (exp.kind === 'scalar') {
			return PP.text(exp.literal)
		} else if (exp.kind === 'application') {
			return PP.hbox([
				pName(exp.operator),
				PP.text("("),
				PP.hbox(intersperse(PP.text(", "), exp.operands.map(pExp))),
				PP.text(")"),
			])
		} else if (exp.kind === 'subscription') {
			return PP.hbox([
				pName(exp.operator),
				PP.text("["),
				PP.hbox(intersperse(PP.text(", "), exp.operands.map(pExp))),
				PP.text("]"),
			])
		} else if (exp.kind === 'binop') {
			return PP.hbox([
				pExp(exp.lft),
				PP.text(exp.operator),
				pExp(exp.rht)
			])
		} else if (exp.kind === 'structure') {
			return PP.vbox([
				PP.text("structure("),
				PP.indent(PP.vbox([
					PP.hbox([PP.text(".Data="), pExp(exp.data)]),
					PP.hbox([PP.text(".Dim="), pExp(exp.dim)])
				])),
				PP.text(")")
			])
		} else if (exp.kind === 'list') {
			return PP.hbox([
				PP.text("list("),
				PP.hbox(intersperse(PP.text(", "), exp.content.map(([name, exp]) => {
					return PP.hbox([
						pName(name),
						PP.text("="),
						pExp(exp)
					])
				}))),
				PP.text(")"),
			])
		} else {
			return PP.hbox([
				PP.text("("),
				pExp(exp.content),
				PP.text(")"),
			])
		}
	}
	function pRelation(rel: bugs.Relation): PP.Doc {
		if (rel.kind === 'for') {
			return PP.vbox([
				PP.hbox([
					PP.text("for ("),
					pName(rel.name),
					PP.text(" in "),
					pExp(rel.domain),
					PP.text(") {")
				]),
				PP.indent(PP.vbox(rel.body.map(pRelation))),
				PP.text("}")
			])
		} else if (rel.kind === "=") {
			return PP.hbox([pExp(rel.lhs), PP.text("<-"), pExp(rel.rhs)])
		} else {
			return PP.hbox([pExp(rel.lhs), PP.text("~"), pExp(rel.rhs)])
		}
	}
	function pList(list: bugs.List): PP.Doc {
		return PP.hbox([PP.text("list("), PP.hbox(list.content.map(([name, exp]) => {
			return PP.hbox([pName(name), pExp(exp)])
		}))])
	}
	function pSession(s: bugs.Session): PP.Doc {
		return PP.vbox([
			PP.hbox([PP.text(s.kind), PP.text(" {")]),
			PP.indent(PP.vbox(s.body.map(pRelation))),
			PP.text("}")
		])
	}
	function pProgram(p: bugs.Program): PP.Doc {
		if (p.kind === 'data') {
			return pList(p.content)
		} else {
			return PP.vbox(p.content.map(pSession))
		}
	}
	return PP.stringOfDoc(pProgram(p));
}

connection.onDocumentFormatting(
	(params, token, workDoneProgress, resultProgress) => {
		const { textDocument: { uri }, options } = params;
		const term = documentContents.get(uri);
		if (term) {
			const formattedText = prettyPrint(term);
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


function positionBefore(p1: Position, p2: Position) {
	return (p1.line < p2.line) || (p1.line == p2.line && p1.character <= p2.character);
}

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
