import { Position } from 'vscode-languageserver';
import * as PETParse from './parseBUGS';

function positionOfPosInfo(pos: PETParse.PosInfo): Position {
	return {
		"line": pos.line,
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

export function parse(sourceCode: string): Error<Program, Position> {
	let parseResult = PETParse.parse(sourceCode);
	if (parseResult.ast !== null) {
		return succeed(transformProgram(parseResult.ast));
	} else {
		return fail(positionOfPosInfo(parseResult.errs[0].pos))
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
	function tExp(exp: PETParse.exp): Expression {
		if (exp.kind === 'name') {
			return { kind: 'variable', name: tName(exp) }
		} else if (exp.kind === 'num') {
			return { kind: 'scalar', literal: exp.value }
		} else if (exp.kind === 'application') {
			let operands: Array<Expression> = [];
			if (exp.operand.content !== null) {
				operands.push(tExp(exp.operand.content.first))
				exp.operand.content.rest.forEach((x) => {
					operands.push(tExp(x.item));
				})
			}
			return { kind: 'application', operator: tName(exp.operator), operands }
		} else if (exp.kind === 'subscript') {
			let operands: Array<Expression> = [];
			if (exp.index.content) {
				operands.push(tExp(exp.index.content.first))
				exp.index.content.rest.forEach((x) => {
					operands.push(tExp(x.item));
				})
			}
			return { kind: 'subscription', operator: tName(exp.vector), operands }
		} else if (exp.kind === 'structure') {
			return { kind: 'structure', data: tExp(exp.data), dim: tExp(exp.dim) }
		} else if (exp.kind === 'list') {
			return tList(exp)
		} else if (exp.kind === 'exp0_7') {
			return { kind: '()', content: tExp(exp.exp) }
		} else if (exp.kind === 'exp1_2') {
			return { kind: 'binop', operator: '+', lft: tExp(exp.left), rht: tExp(exp.right) }
		} else if (exp.kind === 'exp2_2') {
			return { kind: 'binop', operator: '*', lft: tExp(exp.left), rht: tExp(exp.right) }
		} else if (exp.kind === 'exp3_2') {
			return { kind: 'binop', operator: ':', lft: tExp(exp.left), rht: tExp(exp.right) }
		} else {
			throw "Never";
		}
	}
	function tList(list: PETParse.list): List {
		const newArgs: [Name, Expression][] = [];
		const oldArgs = list.content;
		if (oldArgs.content !== null) {
			newArgs.push([tName(oldArgs.content.firstName), tExp(oldArgs.content.firstExp)]);
		}
		return { kind: "list", "content": newArgs }
	}
	function tRelation(relation: PETParse.relation): Relation {
		if (relation.kind === 'stochasticRelation') {
			return { kind: '~', lhs: tExp(relation.lhs), rhs: tExp(relation.rhs) }
		} else if (relation.kind === 'deterministicRelation') {
			return { kind: '=', lhs: tExp(relation.lhs), rhs: tExp(relation.rhs) }
		} else {
			return { kind: 'for', 'name': tName(relation.name), 'domain': tExp(relation.domain), 'body': relation.body.map(tRelation) }
		}
	}
	function tSession(session: PETParse.section): Session {
		if (session.kind === 'model') {
			return { "kind": 'model', 'body': session.body.map(tRelation) }
		} else {
			return { "kind": 'data', 'body': session.body.map(tRelation) }
		}
	}
	if (program.kind === 'program_1') {
		return { kind: 'data', content: tList(program.data) }
	} else {
		return { kind: 'model', content: program.sections.map(tSession) }
	}
}

export type Program = DataProgram | ModelProgram;

export interface DataProgram {
	kind: "data";
	content: List;
}
export interface ModelProgram {
	kind: "model";
	content: Array<Session>;
}

export type Session = ModelSession | DataSession

export interface ModelSession {
	kind: "model";
	body: Array<Relation>;
}

export interface DataSession {
	kind: "data";
	body: Array<Relation>;
}

export type Relation = StochasticRelation | DeterministicRelation | IndexedRelation
export interface StochasticRelation {
	kind: "~"
	lhs: Expression;
	rhs: Expression;
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
	body: Array<Relation>;
}

export type Expression = Variable | Scalar | Application | Subscription | Structure | List | ParenthesizedExpression | BinOp

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

export type Op2 = '+' | '*' | ':'

export interface BinOp {
	kind: 'binop';
	operator: Op2;
	lft: Expression;
	rht: Expression;
}

export interface Application {
	kind: "application";
	operator: Name;
	operands: Array<Expression>;
}

export interface Subscription {
	kind: "subscription";
	operator: Name;
	operands: Array<Expression>;
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
