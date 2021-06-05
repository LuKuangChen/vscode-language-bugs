import { Position } from 'vscode-languageserver';
declare type Error<V, E> = {
    kind: "error";
    content: E;
} | {
    kind: "value";
    content: V;
};
export declare function parse(sourceCode: string): Error<Program, Position>;
export declare type Program = DataProgram | ModelProgram;
export interface DataProgram {
    kind: "data";
    content: List;
}
export interface ModelProgram {
    kind: "model";
    content: Array<Session>;
}
export declare type Session = ModelSession | DataSession;
export interface ModelSession {
    kind: "model";
    body: Array<Relation>;
}
export interface DataSession {
    kind: "data";
    body: Array<Relation>;
}
export declare type Relation = StochasticRelation | DeterministicRelation | IndexedRelation;
export interface StochasticRelation {
    kind: "~";
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
export declare type Expression = Variable | Scalar | Application | Subscription | Structure | List | ParenthesizedExpression | BinOp;
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
export declare type Op2 = '+' | '*' | ':';
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
export {};
