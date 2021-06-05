export type Doc = Txt | Ind | Seq

interface Txt {
	kind: 'txt',
	content: string
}

interface Ind {
	kind: 'ind',
	content: Doc
}

interface Seq {
	kind: 'seq',
	dir: Dir,
	content: Array<Doc>
}

type Dir = 'hbox' | 'vbox'

export function text(content: string): Doc {
	return { kind: 'txt', content };
}

export function indent(content: Doc): Doc {
	return { kind: 'ind', content };
}

export function hbox(content: Array<Doc>): Doc {
	return { kind: 'seq', dir: 'hbox', content }
}
export function vbox(content: Array<Doc>): Doc {
	return { kind: 'seq', dir: 'vbox', content }
}

export function stringOfDoc(doc: Doc, indent: string = '  '): string {
	return linesOfDoc(doc, indent).join('\n');
}

function linesOfDoc(doc: Doc, indent: string = '  '): Array<string> {
	if (doc.kind === 'ind') {
		return linesOfDoc(doc.content).map((line) => {
			return indent + line;
		})
	} else if (doc.kind === 'txt') {
		return [doc.content]
	} else {
		function repeat(s: string, i: number): string {
			if (i === 0) {
				return "";
			} else {
				return s + repeat(s, i - 1);
			}
		}
		if (doc.dir === 'hbox') {
			return doc.content.
				map((doc) => linesOfDoc(doc, indent)).
				reduce((IH, cur) => {
					const lastLine = IH[IH.length - 1];
					return [
						...IH.slice(0, -1),
						lastLine + cur[0],
						...cur.slice(1).map((line) => {
							return repeat(' ', lastLine.length) + line
						})
					]
				})
		} else {
			return doc.content.
				map((doc) => linesOfDoc(doc, indent)).
				reduce((IH, cur) => IH.concat(cur))
		}
	}
}