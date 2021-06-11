import { ParameterStructures, Position } from 'vscode-languageserver';
import * as bugsPeg from './bugsPeg';
import { Doc, makePrinter } from './prettyPrinter';
import { Seq } from './Seq';

const PP = makePrinter('    ')

interface ParseError {
	position: Position;
	message: string;
}

function positionOfPosInfo(pos: bugsPeg.PosInfo): Position {
	return {
		"line": pos.line - 1,
		"character": pos.offset
	}
}

type Error<V, E> = { kind: "error", content: E } | { kind: "value", content: V }

function succeed<V, E>(v: V): Error<V, E> {
	return { kind: "value", content: v }
}

function fail<V, E>(e: E): Error<V, E> {
	return { kind: "error", content: e }
}

function messageOfPegError(e: bugsPeg.SyntaxErr): string {
	let expectations = e.expmatches.
		map((x) => {
			if (x.kind === 'RegexMatch') {
				return x.literal;
			} else {
				return 'EOF'
			}
		}).
		flatMap((entry) => {
			if (entry === '[\\n]') {
				return []
			} else if (entry === '[#]') {
				return []
			} else if (entry === ';') {
				return ["';'"]
			} else if (entry === '\\(') {
				return ["'('"]
			} else if (entry === '\\)') {
				return ["')'"]
			} else if (entry === '\\[') {
				return ["'['"]
			} else if (entry === '\\]') {
				return ["']'"]
			} else if (entry === '{') {
				return ["'{'"]
			} else if (entry === '}') {
				return ["'}'"]
			} else if (entry === '\\+') {
				return ["'+'"]
			} else if (entry === '-') {
				return ["'-'"]
			} else if (entry === '\\*') {
				return ["'*'"]
			} else if (entry === '/') {
				return ["'/'"]
			} else if (entry === ':') {
				return ["':'"]
			} else if (entry === ',') {
				return ["','"]
			} else if (entry === '.') {
				return ["'.'"]
			} else if (entry === '~') {
				return ["'~'"]
			} else if (entry === '=') {
				return ["'='"]
			} else if (entry === '<-') {
				return ["'<-'"]
			} else if (entry === 'C') {
				return ["a 'C(,)'"]
			} else if (entry === 'T') {
				return ["a 'T(,)'"]
			} else if (entry === 'I') {
				return ["a 'I(,)'"]
			} else if (entry === 'in') {
				return ["the keyword 'in'"]
			} else if (entry === 'END') {
				return ["the keyword 'END'"]
			} else if (entry === 'Dim') {
				return ["the word 'Dim'"]
			} else if (entry === 'Data') {
				return ["the word 'Data'"]
			} else if (entry === 'for') {
				return ["a \"for-loop\""]
			} else if (entry === 'data') {
				return ["a data block"]
			} else if (entry === 'model') {
				return ["a model block"]
			} else if (entry === 'c\\(') {
				return ["a 'c()'"]
			} else if (entry === '-?([\\d]+([.][\\d]+)?|([\\d]+)?[.][\\d]+)([eE]-?[\\d]+)?') {
				return ["a number"]
			} else if (entry === '[a-zA-Z][a-zA-Z0-9._]*') {
				return ["a variable"]
			} else if (entry === 'list[(]') {
				return ["a list"]
			} else if (entry === 'structure[(]') {
				return ["a structure"]
			} else {
				return [entry]
			}
		})
	expectations.sort((a, b) => a.length - b.length)
	return `Expecting ${[...expectations].slice(0, -1).join(', ')}, or ${expectations[expectations.length - 1]}`
}

export function parse(sourceCode: string): Error<Program, ParseError[]> {
	let parseResult = bugsPeg.parse(sourceCode);
	if (parseResult.ast !== null) {
		return succeed(transformProgram(parseResult.ast));
	} else {
		const errors: ParseError[] = parseResult.errs.map((e) => {
			return {
				position: positionOfPosInfo(e.pos),
				message: messageOfPegError(e)
			}
		});
		return fail(errors);
	}
}

function transformProgram(program: bugsPeg.program): Program {
	function tName(name: bugsPeg.name): Name {
		return {
			literal: name.value,
			start: positionOfPosInfo(name.from),
			end: positionOfPosInfo(name.to)
		}
	}
	function tExp0(exp: bugsPeg.exp0): Expression {
		if (exp.kind === 'exp0_3') {
			return { kind: '()', content: tExp(exp.exp) }
		} else if (exp.kind === 'name') {
			return { kind: 'variable', name: tName(exp) }
		} else if (exp.kind === 'scalar') {
			return tScalar(exp)
		} else {
			throw "Never";
		}
	}
	const tExpNullable = (e: bugsPeg.exp | null) => {
		if (e === null) {
			return null
		} else {
			return tExp(e);
		}
	}
	function tExp(exp: bugsPeg.exp): Expression {
		if (exp.kind === 'exp2_1') {
			return { kind: 'unop', operator: '-', exp: tExp(exp.exp) }
		} else if (exp.kind === 'exp3_1') {
			const op = (exp.op.kind === 'addSub_1') ? '+' : '-';
			return { kind: 'binop', operator: op, lft: tExp(exp.left), rht: tExp(exp.right) }
		} else if (exp.kind === 'exp4_1') {
			const op = (exp.op.kind === 'mulDiv_1') ? '*' : '/';
			return { kind: 'binop', operator: op, lft: tExp(exp.left), rht: tExp(exp.right) }
		} else if (exp.kind === 'exp5_1') {
			return { kind: 'binop', operator: ':', lft: tExp(exp.left), rht: tExp(exp.right) }
		} else {
			let e: Expression = tExp0(exp.base);
			for (const app of exp.applications) {
				if (app.kind === 'functionApplication') {
					let operands: Array<Expression> = [];
					if (app.operands.content !== null) {
						operands.push(tExp(app.operands.content.first))
						app.operands.content.rest.forEach((x) => {
							operands.push(tExp(x.item));
						})
					}
					e = { kind: 'application', operator: e, operands };
				} else {
					let operands: Array<Expression | null> = [];
					if (app.operands.content) {
						operands.push(tExpNullable(app.operands.content.first))
						app.operands.content.rest.forEach((x) => {
							operands.push(tExpNullable(x.item));
						})
					}
					e = { kind: 'subscription', operator: e, operands }
				}
			}
			return e;
		}
	}
	function tListExp(exp: bugsPeg.listExp): ListExp {
		if (exp.kind === 'scalar') {
			return tScalar(exp)
		} else if (exp.kind === 'NA') {
			return { 'kind': 'NA' }
		} else if (exp.kind === 'structure') {
			return { 'kind': 'structure', 'data': tListExp(exp.data), 'dim': tListExp(exp.dim) }
		} else {
			return { 'kind': 'c', 'content': [tListExp(exp.operands.content.first), ...exp.operands.content.rest.map(({ sep, item }) => tListExp(item))] }
		}
	}
	function tList(list: bugsPeg.list): List {
		const operands: [Name, ListExp][] = [];
		function tField(field: bugsPeg.field): [Name, ListExp] {
			return [tName(field.name), tListExp(field.value)]
		}
		if (list.operands.content !== null) {
			operands.push(tField(list.operands.content.first))
			operands.push(...list.operands.content.rest.map(({ sep, item }) => {
				return tField(item);
			}))
		}
		return { kind: "list", "content": operands }
	}
	function tRelation(relation: bugsPeg.relation): Relation {
		if (relation.kind === 'stochasticRelation') {
			let cti: StochasticRelation['cti'];
			if (relation.cti === null) {
				cti = null;
			} else {
				const header = (
					relation.cti.header.kind === 'ctiHeader_1'
						? 'C'
						: relation.cti.header.kind === 'ctiHeader_2'
							? 'T'
							: 'I')
				cti = {
					kind: header,
					lower: tExpNullable(relation.cti.lower),
					upper: tExpNullable(relation.cti.upper)
				};
			}
			return {
				kind: '~', lhs: tExp(relation.lhs),
				rhs: tExp(relation.rhs), cti
			}
		} else if (relation.kind === 'deterministicRelation') {
			return {
				kind: '=',
				lhs: tExp(relation.lhs),
				rhs: tExp(relation.rhs),
			}
		} else {
			return {
				kind: 'for',
				'name': tName(relation.name),
				'domain': tExp(relation.domain),
				'body': tBlock(relation.body)
			}
		}
	}
	function tSepItem(sep: bugsPeg.sepItem): Array<SeperatorItem> {
		if (sep.kind === 'newline') {
			return [tNewline(sep)]
		} else {
			return [tComment(sep)];
		}
	}
	function tRelationSep(sep: bugsPeg.relationSep): Array<SeperatorItem> {
		return sep.body.flatMap(({ sep, item }) => {
			if (item.kind === 'relationSepItem_2') {
				return []
			} else {
				return tSepItem(item)
			}
		})
	}
	function tBlock(block: bugsPeg.block): Block {
		const relations: Relation[] = [];
		const seperators: SeperatorItem[][] = [];
		seperators.push(tRelationSep(block.before))
		relations.push(tRelation(block.body.head));
		seperators.push(...block.body.tail.map(({ sep, item }) => {
			return tRelationSep(sep)
		}));
		relations.push(...block.body.tail.map(({ sep, item }) => {
			return tRelation(item)
		}));
		seperators.push(tRelationSep(block.after))
		return { relations, seperators };
	}
	function tScalar(scalar: bugsPeg.scalar): Scalar {
		return { kind: 'scalar', literal: scalar.value }
	}
	function tSection(section: bugsPeg.section): Section {
		const kind = (section.header.kind === 'sectionHeader_1'
			? 'model'
			: 'data');
		return {
			"kind": kind,
			'body': tBlock(section.body)
		}
	}
	function tNewline(x: bugsPeg.newline): SeperatorItem {
		return { kind: 'newline' };
	}
	function tComment(x: bugsPeg.comment): SeperatorItem {
		return { kind: 'comment', content: x.content }
	}
	function tProgramBody(program: bugsPeg.programBody): List | TableProgram | ModelProgram {
		if (program.kind === 'list') {
			return tList(program)
		} else if (program.kind === 'rectangular') {
			const header = program.header.content.map(({ sep, item }) => {
				return tName(item);
			})
			const body = program.body.map(({ sep, item }) => {
				return item.content.map(({ sep, item }) => {
					return tScalar(item)
				})
			})
			return {
				kind: 'table',
				header: header,
				body: body
			}
		} else {
			const sections: Array<Section> = [];
			sections.push(tSection(program.head))
			sections.push(...program.tail.map(({ sep, item }) => {
				return tSection(item)
			}))
			return { kind: 'model', content: sections }
		}
	}
	const before = program.before.body.flatMap(({ sep, item }) => tSepItem(item))
	const after = program.after.body.flatMap(({ sep, item }) => tSepItem(item))
	return { before, after, body: tProgramBody(program.body) }
}

export interface Program {
	before: Array<SeperatorItem>;
	body: ProgramBody;
	after: Array<SeperatorItem>;
}

export type ProgramBody = List | TableProgram | ModelProgram;

export interface TableProgram {
	kind: 'table';
	header: Array<Name>
	body: Array<Array<Scalar>>
}
export interface ModelProgram {
	kind: "model";
	content: Array<Section>;
}

export const isNewline = (w: SeperatorItem) => {
	return w.kind === 'newline';
}

export interface Block {
	relations: Relation[];
	seperators: SeperatorItem[][];
}

export type SeperatorItem = Newline | Comment
export interface Newline {
	kind: 'newline'
}
export interface Comment {
	kind: 'comment';
	content: string;
}


export interface Section {
	kind: "model" | 'data';
	body: Block;
}

export type Relation = StochasticRelation | DeterministicRelation | IndexedRelation
export interface StochasticRelation {
	kind: "~"
	lhs: Expression;
	rhs: Expression;
	cti: null | {
		kind: 'C' | 'T' | 'I';
		lower: Expression | null;
		upper: Expression | null;
	}
}
export interface DeterministicRelation {
	kind: "=";
	lhs: Expression;
	rhs: Expression;
}
export interface IndexedRelation {
	kind: "for";
	name: Name;
	domain: Expression;
	body: Block;
}

export type Expression = Variable | Scalar | Application | Subscription | ParenthesizedExpression | BinOp | UnOp

export interface Variable {
	kind: "variable";
	name: Name;
}

export interface Name {
	literal: string;
	start: Position;
	end: Position;
}

export interface Scalar {
	kind: 'scalar';
	literal: string;
}

export type Op1 = '-'
export type Op2 = '+' | '-' | '*' | '/' | ':'

export interface UnOp {
	kind: 'unop';
	operator: Op1;
	exp: Expression;
}

export interface BinOp {
	kind: 'binop';
	operator: Op2;
	lft: Expression;
	rht: Expression;
}

export interface Application {
	kind: "application";
	operator: Expression;
	operands: Array<Expression>;
}

export interface Subscription {
	kind: "subscription";
	operator: Expression;
	operands: Array<Expression | null>;
}

export interface Structure {
	kind: "structure";
	data: ListExp;
	dim: ListExp;
}

export interface List {
	kind: "list";
	content: Array<[Name, ListExp]>;
}

export type ListExp = Scalar | NA | Structure | ListExpC;

export interface NA {
	kind: 'NA'
}

export interface ListExpC {
	kind: 'c',
	content: Array<ListExp>
}

export interface ParenthesizedExpression {
	kind: "()";
	content: Expression;
}

export function prettyPrint(p: Program): string {
	function pName(name: Name): Doc {
		return PP.text(name.literal);
	}
	const pExpNullable = (e: Expression | null) => {
		if (e === null) {
			return PP.text("")
		} else {
			return pExp(e);
		}
	}
	function pScalar(scalar: Scalar): Doc {
		return PP.text(scalar.literal)
	}
	function pExp(exp: Expression): Doc {
		if (exp.kind === 'variable') {
			return pName(exp.name);
		} else if (exp.kind === 'scalar') {
			return pScalar(exp)
		} else if (exp.kind === 'application') {
			return PP.fconcat([
				pExp(exp.operator),
				PP.text("("),
				PP.fconcat(Seq.intersperse(PP.text(", "), exp.operands.map(pExp))),
				PP.text(")"),
			])
		} else if (exp.kind === 'subscription') {
			return PP.fconcat([
				pExp(exp.operator),
				PP.text("["),
				PP.fconcat(Seq.intersperse(PP.text(", "), exp.operands.map(pExpNullable))),
				PP.text("]"),
			])
		} else if (exp.kind === 'binop') {
			return PP.fconcat([
				pExp(exp.lft),
				PP.text(' '),
				PP.text(exp.operator),
				PP.text(' '),
				pExp(exp.rht)
			])
		} else if (exp.kind === 'unop') {
			return PP.fconcat([
				PP.text(exp.operator),
				PP.text(' '),
				pExp(exp.exp)
			])
		} else {
			return PP.fconcat([
				PP.text("("),
				pExp(exp.content),
				PP.text(")"),
			])
		}
	}
	function pListExp(exp: ListExp): Doc {
		if (exp.kind === 'scalar') {
			return pScalar(exp)
		} else if (exp.kind === 'NA') {
			return PP.text('NA')
		} else if (exp.kind === 'structure') {
			return pStructure(exp)
		} else {
			return PP.fconcat([
				PP.text("c("),
				...Seq.intersperse(
					PP.text(', '),
					exp.content.map(pListExp)),
				PP.text(')')
			])
		}
	}
	function pStructure(exp: Structure): Doc {
		return PP.vconcat([
			PP.text("structure("),
			PP.nest(PP.vconcat([
				PP.fconcat([
					PP.fconcat([PP.text(".Data="), pListExp(exp.data)]),
					PP.text(',')
				]),
				PP.fconcat([PP.text(".Dim="), pListExp(exp.dim)])
			])),
			PP.text(")")
		])
	}
	function pCTI(cti: StochasticRelation['cti']): Doc {
		if (cti === null) {
			return PP.text("")
		} else {
			return PP.fconcat([
				PP.text(cti.kind),
				PP.text('('),
				pExpNullable(cti.lower),
				PP.text(', '),
				pExpNullable(cti.upper),
				PP.text(')'),
			])
		}
	}
	function pComment(cmt: Comment): Doc {
		return PP.text("#" + cmt.content)
	}
	function pSeperator(item: SeperatorItem): Doc {
		if (item.kind === 'newline') {
			return PP.text("")
		} else {
			return pComment(item)
		}
	}
	function pSeperators(seps: Array<SeperatorItem>): Array<Doc> {
		return seps.map(pSeperator)
	}
	function pBlock(block: Block): Doc {
		type SimpleRelation = StochasticRelation | DeterministicRelation;
		type BlockSection = SimpleRelationSection | IndexedRelation | SeperatorSection;
		interface SimpleRelationSection {
			kind: 'srs';
			rels: { r: SimpleRelation, c?: Comment }[];
		}
		interface SeperatorSection {
			kind: 'ss';
			sep: SeperatorItem[];
		}
		function group(block: Block): BlockSection[] {
			const result: BlockSection[] = [];
			function pushSep(sep: SeperatorItem[]) {
				if (sep.length > 0 && sep[0].kind === 'newline') {
					sep = sep.slice(1)
				}
				if (sep.length > 0) {
					result.push({ kind: 'ss', sep })
				}
			}
			pushSep(block.seperators[0])
			for (let i = 0; i < block.relations.length; i++) {
				const r = block.relations[i];
				let c = block.seperators[i + 1];
				if (r.kind === 'for') {
					result.push(r)
					pushSep(c)
				} else {
					const last = result.length > 0 ? result[result.length - 1] : undefined;
					let lastSrs: SimpleRelationSection;
					if (last !== undefined && last.kind === 'srs') {
						last.rels.push({ r })
						lastSrs = last;
					} else {
						lastSrs = { kind: 'srs', rels: [{ r }] }
						result.push(lastSrs)
					}
					if (c.length > 0 && c[0].kind === 'comment') {
						lastSrs.rels[lastSrs.rels.length - 1].c = c[0]
						c[0] = { kind: 'newline' }
					}
					pushSep(c)
				}
			}
			return result;
		}
		const blockSections = group(block);
		return PP.vconcat(blockSections.map((bc) => {
			if (bc.kind === 'for') {
				return pRelation(bc)
			} else if (bc.kind === 'srs') {
				return PP.equations(bc.rels.map(({ r, c }) => {
					let suffix = (c === undefined
						? PP.text('')
						: PP.fconcat([PP.text(' '), pComment(c)]))
					if (r.kind === '=') {
						return [pExp(r.lhs), ' <- ', PP.fconcat([pExp(r.rhs), suffix])]
					} else {
						suffix = PP.fconcat([pCTI(r.cti), suffix])
						return [pExp(r.lhs), ' ~ ', PP.fconcat([pExp(r.rhs), suffix])]
					}
				}))
			} else {
				return PP.vconcat(pSeperators(bc.sep))
			}
		}))
	}
	function pRelation(rel: Relation): Doc {
		if (rel.kind === 'for') {
			return PP.vconcat([
				PP.fconcat([
					PP.text("for ("),
					pName(rel.name),
					PP.text(" in "),
					pExp(rel.domain),
					PP.text(") {")
				]),
				PP.nest(pBlock(rel.body)),
				PP.text("}")
			])
		} else if (rel.kind === "=") {
			return PP.vconcat([
				PP.fconcat([
					pExp(rel.lhs),
					PP.text(' <- '),
					pExp(rel.rhs),
				]),
			])
		} else {
			return PP.vconcat([
				PP.fconcat([
					pExp(rel.lhs),
					PP.text(' ~ '),
					pExp(rel.rhs),
					pCTI(rel.cti),
				]),
			])
		}
	}
	function pList(list: List): Doc {
		return PP.fconcat([
			PP.text("list("),
			...Seq.intersperse(
				PP.text(', '),
				list.content.map(([name, exp]) => {
					return PP.fconcat([pName(name), PP.text(' = '), pListExp(exp)])
				})),
			PP.text(')')
		])
	}
	function pSection(s: Section): Doc {
		return PP.vconcat([
			PP.vconcat([
				PP.text(s.kind),
				PP.text("{"),
			]),
			PP.nest(pBlock(s.body)),
			PP.fconcat([PP.text("}")])
		])
	}
	function pProgram(p: Program): Doc {
		let before = p.before;
		let after = p.after;
		while (after.length > 0 && after[after.length - 1].kind === 'newline') {
			after = after.slice(0, -1)
		}
		return PP.vconcat([
			...pSeperators(before),
			pProgramBody(p.body),
			...pSeperators(after)
		])
	}
	function pProgramBody(p: ProgramBody): Doc {
		if (p.kind === 'list') {
			return pList(p)
		} if (p.kind === 'table') {
			return PP.vconcat([
				PP.fconcat(Seq.intersperse(PP.text(' '), p.header.map((name) => PP.fconcat([pName(name), PP.text('[]')])))),
				PP.vconcat(
					p.body.map((row) => {
						return PP.fconcat(Seq.intersperse(PP.text(' '), row.map(pScalar)))
					})
				),
				PP.text('END')
			])
		} else {
			return PP.vconcat(p.content.map(pSection))
		}
	}
	return PP.toString(pProgram(p));
}
