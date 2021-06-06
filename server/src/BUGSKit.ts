import { SpawnOptions } from 'child_process';
import { intersperse, line } from 'prettier-printer';
import { ppid } from 'process';
import { Position } from 'vscode-languageserver';
import * as PETParse from './parseBUGS';
import * as PP from './prettyPrinter';
import { Seq } from './Seq';

interface ParseError {
	position: Position;
	message: string;
}

function positionOfPosInfo(pos: PETParse.PosInfo): Position {
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

export function parse(sourceCode: string): Error<Program, ParseError[]> {
	let parseResult = PETParse.parse(sourceCode);
	if (parseResult.ast !== null) {
		return succeed(transformProgram(parseResult.ast));
	} else {
		const errors: ParseError[] = parseResult.errs.map((e) => {
			return {
				position: positionOfPosInfo(e.pos),
				message: e.toString()
			}
		});
		return fail(errors);
	}
}

function transformProgram(program: PETParse.program): Program {
	function tName(name: PETParse.name): Name {
		return {
			literal: name.value,
			start: positionOfPosInfo(name.from),
			end: positionOfPosInfo(name.to)
		}
	}
	function tExp0(exp: PETParse.exp0): Expression {
		if (exp.kind === 'exp0_4') {
			return { kind: '()', content: tExp(exp.exp) }
		} else if (exp.kind === 'name') {
			return { kind: 'variable', name: tName(exp) }
		} else if (exp.kind === 'scalar') {
			return tScalar(exp)
		} else if (exp.kind === 'structure') {
			return { kind: 'structure', data: tExp(exp.data), dim: tExp(exp.dim) }
		} else if (exp.kind === 'list') {
			return tList(exp)
		} else {
			throw "Never";
		}
	}
	const tExpNullable = (e: PETParse.exp | null) => {
		if (e === null) {
			return null
		} else {
			return tExp(e);
		}
	}
	function tExp(exp: PETParse.exp): Expression {
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
	function tList(list: PETParse.list): List {
		const operands: [Name, Expression][] = [];
		function tField(field: PETParse.field): [Name, Expression] {
			return [tName(field.name), tExp(field.value)]
		}
		if (list.operands.content !== null) {
			operands.push(tField(list.operands.content.first))
			operands.push(...list.operands.content.rest.map(({ sep, item }) => {
				return tField(item);
			}))
		}
		return { kind: "list", "content": operands }
	}
	function tRelation(relation: PETParse.relation): Relation {
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
	function tSepItem(sep: PETParse.sepItem): Array<Seperator> {
		if (sep.kind === 'newline') {
			return [tNewline(sep)]
		} else {
			return [tComment(sep)];
		}
	}
	function tRelationSep(sep: PETParse.relationSep): Array<Seperator> {
		return sep.body.flatMap(({ sep, item }) => {
			if (item.kind === 'relationSepItem_2') {
				return []
			} else {
				return tSepItem(item)
			}
		})
	}
	function tBlock(block: PETParse.block): Block {
		const blockItems: Block = [];
		blockItems.push(...tRelationSep(block.before))
		blockItems.push(tRelation(block.body.head));
		blockItems.push(...block.body.tail.flatMap(({ sep, item }) => {
			return [...tRelationSep(sep), tRelation(item)]
		}));
		blockItems.push(...tRelationSep(block.after))
		return blockItems;
	}
	function tScalar(scalar: PETParse.scalar): Scalar {
		return { kind: 'scalar', literal: scalar.value }
	}
	function tSection(section: PETParse.section): Section {
		const kind = (section.header.kind === 'sectionHeader_1'
			? 'model'
			: 'data');
		return {
			"kind": kind,
			'body': tBlock(section.body)
		}
	}
	function tNewline(x: PETParse.newline): Seperator {
		return { kind: 'newline' };
	}
	function tComment(x: PETParse.comment): Seperator {
		return { kind: 'comment', content: x.content }
	}
	function tProgramBody(program: PETParse.programBody): List | TableProgram | ModelProgram {
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
	before: Array<Seperator>;
	body: ProgramBody;
	after: Array<Seperator>;
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

export const isNewline = (w: Seperator) => {
	return w.kind === 'newline';
}

export type Block = Array<BlockItem>
export type BlockItem = Relation | Seperator

export type Seperator = Newline | Comment
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

export type Expression = Variable | Scalar | Application | Subscription | Structure | List | ParenthesizedExpression | BinOp | UnOp

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
	data: Expression;
	dim: Expression;
}

export interface List {
	kind: "list";
	content: Array<[Name, Expression]>;
}

export interface ParenthesizedExpression {
	kind: "()";
	content: Expression;
}

export function prettyPrint(p: Program): string {
	function pName(name: Name): PP.Doc {
		return PP.text(name.literal);
	}
	const pExpNullable = (e: Expression | null) => {
		if (e === null) {
			return PP.text("")
		} else {
			return pExp(e);
		}
	}
	function pScalar(scalar: Scalar): PP.Doc {
		return PP.text(scalar.literal)
	}
	function pExp(exp: Expression): PP.Doc {
		if (exp.kind === 'variable') {
			return pName(exp.name);
		} else if (exp.kind === 'scalar') {
			return pScalar(exp)
		} else if (exp.kind === 'application') {
			return PP.fcatIndent([
				pExp(exp.operator),
				PP.text("("),
				PP.fcatIndent(Seq.intersperse(PP.text(", "), exp.operands.map(pExp))),
				PP.text(")"),
			])
		} else if (exp.kind === 'subscription') {
			return PP.fcatIndent([
				pExp(exp.operator),
				PP.text("["),
				PP.fcatIndent(Seq.intersperse(PP.text(", "), exp.operands.map(pExpNullable))),
				PP.text("]"),
			])
		} else if (exp.kind === 'binop') {
			return PP.fcatIndent([
				pExp(exp.lft),
				PP.text(' '),
				PP.text(exp.operator),
				PP.text(' '),
				pExp(exp.rht)
			])
		} else if (exp.kind === 'unop') {
			return PP.fcatIndent([
				PP.text(exp.operator),
				PP.text(' '),
				pExp(exp.exp)
			])
		} else if (exp.kind === 'structure') {
			return PP.lines([
				PP.text("structure("),
				PP.indent(PP.lines([
					PP.fcat([
						PP.fcatIndent([PP.text(".Data="), pExp(exp.data)]),
						PP.text(',')
					]),
					PP.fcatIndent([PP.text(".Dim="), pExp(exp.dim)])
				])),
				PP.text(")")
			])
		} else if (exp.kind === 'list') {
			return PP.fcatIndent([
				PP.text("list("),
				PP.fcatIndent(Seq.intersperse(PP.text(", "), exp.content.map(([name, exp]) => {
					return PP.fcatIndent([
						pName(name),
						PP.text("="),
						pExp(exp)
					])
				}))),
				PP.text(")"),
			])
		} else {
			return PP.fcatIndent([
				PP.text("("),
				pExp(exp.content),
				PP.text(")"),
			])
		}
	}
	function pCTI(cti: StochasticRelation['cti']): PP.Doc {
		if (cti === null) {
			return PP.text("")
		} else {
			return PP.fcatIndent([
				PP.text(cti.kind),
				PP.text('('),
				pExpNullable(cti.lower),
				PP.text(', '),
				pExpNullable(cti.upper),
				PP.text(')'),
			])
		}
	}
	function pComment(cmt: Comment): PP.Doc {
		return PP.lines([
			PP.text("#" + cmt.content),
			PP.text('')
		])
	}
	function pSeperator(item: Seperator): PP.Doc {
		if (item.kind === 'newline') {
			return PP.lines([PP.text(""), PP.text("")])
		} else {
			return pComment(item)
		}
	}
	function pSeperators(seps: Array<Seperator>): Array<PP.Doc> {
		return seps.map(pSeperator)
	}
	function pBlock(block: Block): PP.Doc {
		let fromItem = 0;
		let toItem = block.length;
		// skip beginning newlines
		while (block[fromItem].kind === 'newline') {
			fromItem++;
		}
		// skip ending newlines
		while (block[toItem - 1].kind === 'newline') {
			toItem--;
		}
		block = block.slice(fromItem, toItem)
		return PP.fcat(block.map((item) => {
			if (item.kind === 'newline' || item.kind === 'comment') {
				return pSeperator(item)
			} else {
				return pRelation(item)
			}
		}))
	}
	function pRelation(rel: Relation): PP.Doc {
		if (rel.kind === 'for') {
			return PP.lines([
				PP.fcatIndent([
					PP.text("for ("),
					pName(rel.name),
					PP.text(" in "),
					pExp(rel.domain),
					PP.text(") {")
				]),
				PP.indent(pBlock(rel.body)),
				PP.text("}")
			])
		} else if (rel.kind === "=") {
			return PP.lines([
				PP.fcatIndent([
					pExp(rel.lhs),
					PP.text(' <- '),
					pExp(rel.rhs),
				]),
			])
		} else {
			return PP.lines([
				PP.fcatIndent([
					pExp(rel.lhs),
					PP.text(' ~ '),
					pExp(rel.rhs),
					pCTI(rel.cti),
				]),
			])
		}
	}
	function pList(list: List): PP.Doc {
		return PP.fcat([
			PP.text("list("),
			...Seq.intersperse(
				PP.text(', '),
				list.content.map(([name, exp]) => {
					return PP.fcat([pName(name), PP.text(' = '), pExp(exp)])
				})),
			PP.text(')')
		])
	}
	function pSection(s: Section): PP.Doc {
		return PP.lines([
			PP.fcatIndent([
				PP.text(s.kind),
				PP.text(" {"),
			]),
			PP.indent(pBlock(s.body)),
			PP.fcatIndent([PP.text("}")])
		])
	}
	function pProgram(p: Program): PP.Doc {
		let before = p.before;
		while (before.length > 0 && before[0].kind === 'newline') {
			before = before.slice(1)
		}
		let after = p.after;
		while (after.length > 0 && after[after.length - 1].kind === 'newline') {
			after = after.slice(0, -1)
		}
		return PP.lines([
			...pSeperators(before),
			pProgramBody(p.body),
			...pSeperators(after)
		])
	}
	function pProgramBody(p: ProgramBody): PP.Doc {
		if (p.kind === 'list') {
			return pList(p)
		} if (p.kind === 'table') {
			return PP.lines([
				PP.fcat(Seq.intersperse(PP.text(' '), p.header.map(pName))),
				PP.lines(
					p.body.map((row) => {
						return PP.fcat(Seq.intersperse(PP.text(' '), row.map(pScalar)))
					})
				),
				PP.text('END')
			])
		} else {
			return PP.lines(p.content.map(pSection))
		}
	}
	return PP.stringOfDoc(pProgram(p), '\t');
}
