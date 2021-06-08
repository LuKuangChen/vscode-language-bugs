export type Doc = Array<string>

export function makePrinter(indent = '  ') {

	function text(content: string): Doc {
		return [content];
	}

	function nest(content: Doc): Doc {
		return content.map((line) => indent + line);
	}


	function repeat(s: string, i: number): string {
		if (i === 0) {
			return "";
		} else {
			return s + repeat(s, i - 1);
		}
	}

	function fconcat(content: Array<Doc>): Doc {
		return content.
				reduce((IH, cur) => {
					const lastLine = IH[IH.length - 1];
					return [
						...IH.slice(0, -1),
						lastLine + cur[0],
						...cur.slice(1)
					]
				}, [""])
	}

	function inlineBlock(content: Array<Doc>): Doc {
		return content.
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

	function vconcat(content: Array<Doc>): Doc {
		return content.flatMap((x) => x);
	}

	function toString(doc: Doc): string {
		return doc.join('\n');
	}

	function equations(eqs: Array<[Doc, string, Doc]>) {
		const lhsWidth = Math.max(...eqs.flatMap(([lhs, r, rhs]) => {
			return lhs.map((line) => line.length)
		}))
		const rWidth = Math.max(...eqs.map(([lhs, r, rhs]) => {
			return r.length
		}))
		return vconcat([
			// text(lhsWidth.toString()),
			// text(rWidth.toString()),
			...eqs.map(([lhs, r, rhs]) => {
				lhs[lhs.length - 1] += repeat(' ', lhsWidth - lhs[lhs.length - 1].length)
				r = repeat(' ', rWidth - r.length) + r
				return fconcat([
					lhs, text(r), rhs
				])
			})
		])
	}

	return {
		text, nest, vconcat, fconcat, inlineBlock, toString, equations
	}
}

