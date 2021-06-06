import { ConnectionError } from 'vscode-jsonrpc';

export type Doc = (indent: string) => Array<string>

export function text(content: string): Doc {
	return (_) => [content];
}

export function indent(content: Doc): Doc {
	return (indentTxt) => content(indentTxt).map((line) => indentTxt + line);
}


function repeat(s: string, i: number): string {
	if (i === 0) {
		return "";
	} else {
		return s + repeat(s, i - 1);
	}
}

export function fcat(content: Array<Doc>): Doc {
	return (indent) =>
		content.
			map((doc) => doc(indent)).
			reduce((IH, cur) => {
				const lastLine = IH[IH.length - 1];
				return [
					...IH.slice(0, -1),
					lastLine + cur[0],
					...cur.slice(1)
				]
			}, [""])
}

export function fcatIndent(content: Array<Doc>): Doc {
	return (indent) =>
		content.
			map((doc) => doc(indent)).
			reduce((IH, cur) => {
				const lastLine = IH[IH.length - 1];
				return [
					...IH.slice(0, -1),
					lastLine + cur[0],
					...cur.slice(1).map((line) => {
						return repeat(' ', lastLine.length) + line
					})
				]
			}, [""])
}

export function lines(content: Array<Doc>): Doc {
	return (indent) => content.flatMap((doc) => {
		return doc(indent)
	})
}

export function stringOfDoc(doc: Doc, indent: string = '  '): string {
	return doc(indent).join('\n');
}