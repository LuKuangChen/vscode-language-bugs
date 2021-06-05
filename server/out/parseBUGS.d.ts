declare type Nullable<T> = T | null;
export declare enum ASTKinds {
    program_1 = "program_1",
    program_2 = "program_2",
    section_1 = "section_1",
    section_2 = "section_2",
    model = "model",
    data = "data",
    relation_1 = "relation_1",
    relation_2 = "relation_2",
    relation_3 = "relation_3",
    stochasticRelation = "stochasticRelation",
    deterministicRelation = "deterministicRelation",
    indexedRelation = "indexedRelation",
    exp = "exp",
    application = "application",
    subscript = "subscript",
    structure = "structure",
    list = "list",
    anonArgs = "anonArgs",
    anonArgs_$0 = "anonArgs_$0",
    anonArgsRest = "anonArgsRest",
    namedArgs = "namedArgs",
    namedArgs_$0 = "namedArgs_$0",
    namedArgsRest = "namedArgsRest",
    exp0_1 = "exp0_1",
    exp0_2 = "exp0_2",
    exp0_3 = "exp0_3",
    exp0_4 = "exp0_4",
    exp0_5 = "exp0_5",
    exp0_6 = "exp0_6",
    exp0_7 = "exp0_7",
    exp1_1 = "exp1_1",
    exp1_2 = "exp1_2",
    exp2_1 = "exp2_1",
    exp2_2 = "exp2_2",
    exp3_1 = "exp3_1",
    exp3_2 = "exp3_2",
    name = "name",
    num = "num",
    ws_1 = "ws_1",
    ws_2 = "ws_2"
}
export declare type program = program_1 | program_2;
export interface program_1 {
    kind: ASTKinds.program_1;
    data: list;
}
export interface program_2 {
    kind: ASTKinds.program_2;
    sections: section[];
}
export declare type section = section_1 | section_2;
export declare type section_1 = model;
export declare type section_2 = data;
export interface model {
    kind: ASTKinds.model;
    body: relation[];
}
export interface data {
    kind: ASTKinds.data;
    body: relation[];
}
export declare type relation = relation_1 | relation_2 | relation_3;
export declare type relation_1 = stochasticRelation;
export declare type relation_2 = deterministicRelation;
export declare type relation_3 = indexedRelation;
export interface stochasticRelation {
    kind: ASTKinds.stochasticRelation;
    lhs: exp;
    rhs: exp;
}
export interface deterministicRelation {
    kind: ASTKinds.deterministicRelation;
    lhs: exp;
    rhs: exp;
}
export interface indexedRelation {
    kind: ASTKinds.indexedRelation;
    name: name;
    domain: exp;
    body: relation[];
}
export declare type exp = exp3;
export interface application {
    kind: ASTKinds.application;
    operator: name;
    operand: anonArgs;
}
export interface subscript {
    kind: ASTKinds.subscript;
    vector: name;
    index: anonArgs;
}
export interface structure {
    kind: ASTKinds.structure;
    data: exp;
    dim: exp;
}
export interface list {
    kind: ASTKinds.list;
    content: namedArgs;
}
export interface anonArgs {
    kind: ASTKinds.anonArgs;
    content: Nullable<anonArgs_$0>;
}
export interface anonArgs_$0 {
    kind: ASTKinds.anonArgs_$0;
    first: exp;
    rest: anonArgsRest[];
}
export interface anonArgsRest {
    kind: ASTKinds.anonArgsRest;
    item: exp;
}
export interface namedArgs {
    kind: ASTKinds.namedArgs;
    content: Nullable<namedArgs_$0>;
}
export interface namedArgs_$0 {
    kind: ASTKinds.namedArgs_$0;
    firstName: name;
    firstExp: exp;
    rest: namedArgsRest[];
}
export interface namedArgsRest {
    kind: ASTKinds.namedArgsRest;
    name: name;
    value: exp;
}
export declare type exp0 = exp0_1 | exp0_2 | exp0_3 | exp0_4 | exp0_5 | exp0_6 | exp0_7;
export declare type exp0_1 = name;
export declare type exp0_2 = num;
export declare type exp0_3 = application;
export declare type exp0_4 = subscript;
export declare type exp0_5 = structure;
export declare type exp0_6 = list;
export interface exp0_7 {
    kind: ASTKinds.exp0_7;
    exp: exp3;
}
export declare type exp1 = exp1_1 | exp1_2;
export declare type exp1_1 = exp0;
export interface exp1_2 {
    kind: ASTKinds.exp1_2;
    left: exp0;
    right: exp1;
}
export declare type exp2 = exp2_1 | exp2_2;
export declare type exp2_1 = exp1;
export interface exp2_2 {
    kind: ASTKinds.exp2_2;
    left: exp1;
    right: exp2;
}
export declare type exp3 = exp3_1 | exp3_2;
export declare type exp3_1 = exp2;
export interface exp3_2 {
    kind: ASTKinds.exp3_2;
    left: exp2;
    right: exp3;
}
export interface name {
    kind: ASTKinds.name;
    from: PosInfo;
    value: string;
    to: PosInfo;
}
export interface num {
    kind: ASTKinds.num;
    value: string;
}
export declare type ws = ws_1 | ws_2;
export declare type ws_1 = string;
export interface ws_2 {
    kind: ASTKinds.ws_2;
}
export declare class Parser {
    private readonly input;
    private pos;
    private negating;
    private memoSafe;
    constructor(input: string);
    reset(pos: PosInfo): void;
    finished(): boolean;
    clearMemos(): void;
    matchprogram($$dpth: number, $$cr?: ErrorTracker): Nullable<program>;
    matchprogram_1($$dpth: number, $$cr?: ErrorTracker): Nullable<program_1>;
    matchprogram_2($$dpth: number, $$cr?: ErrorTracker): Nullable<program_2>;
    matchsection($$dpth: number, $$cr?: ErrorTracker): Nullable<section>;
    matchsection_1($$dpth: number, $$cr?: ErrorTracker): Nullable<section_1>;
    matchsection_2($$dpth: number, $$cr?: ErrorTracker): Nullable<section_2>;
    matchmodel($$dpth: number, $$cr?: ErrorTracker): Nullable<model>;
    matchdata($$dpth: number, $$cr?: ErrorTracker): Nullable<data>;
    matchrelation($$dpth: number, $$cr?: ErrorTracker): Nullable<relation>;
    matchrelation_1($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_1>;
    matchrelation_2($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_2>;
    matchrelation_3($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_3>;
    matchstochasticRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<stochasticRelation>;
    matchdeterministicRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<deterministicRelation>;
    matchindexedRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<indexedRelation>;
    matchexp($$dpth: number, $$cr?: ErrorTracker): Nullable<exp>;
    matchapplication($$dpth: number, $$cr?: ErrorTracker): Nullable<application>;
    matchsubscript($$dpth: number, $$cr?: ErrorTracker): Nullable<subscript>;
    matchstructure($$dpth: number, $$cr?: ErrorTracker): Nullable<structure>;
    matchlist($$dpth: number, $$cr?: ErrorTracker): Nullable<list>;
    matchanonArgs($$dpth: number, $$cr?: ErrorTracker): Nullable<anonArgs>;
    matchanonArgs_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<anonArgs_$0>;
    matchanonArgsRest($$dpth: number, $$cr?: ErrorTracker): Nullable<anonArgsRest>;
    matchnamedArgs($$dpth: number, $$cr?: ErrorTracker): Nullable<namedArgs>;
    matchnamedArgs_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<namedArgs_$0>;
    matchnamedArgsRest($$dpth: number, $$cr?: ErrorTracker): Nullable<namedArgsRest>;
    matchexp0($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0>;
    matchexp0_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_1>;
    matchexp0_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_2>;
    matchexp0_3($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_3>;
    matchexp0_4($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_4>;
    matchexp0_5($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_5>;
    matchexp0_6($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_6>;
    matchexp0_7($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_7>;
    matchexp1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp1>;
    matchexp1_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp1_1>;
    matchexp1_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp1_2>;
    matchexp2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2>;
    matchexp2_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2_1>;
    matchexp2_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2_2>;
    matchexp3($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3>;
    matchexp3_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3_1>;
    matchexp3_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3_2>;
    matchname($$dpth: number, $$cr?: ErrorTracker): Nullable<name>;
    matchnum($$dpth: number, $$cr?: ErrorTracker): Nullable<num>;
    matchws($$dpth: number, $$cr?: ErrorTracker): Nullable<ws>;
    matchws_1($$dpth: number, $$cr?: ErrorTracker): Nullable<ws_1>;
    matchws_2($$dpth: number, $$cr?: ErrorTracker): Nullable<ws_2>;
    test(): boolean;
    parse(): ParseResult;
    mark(): PosInfo;
    private loop;
    private run;
    private choice;
    private regexAccept;
    private tryConsume;
    private noConsume;
    private negate;
    private memoise;
}
export declare function parse(s: string): ParseResult;
export interface ParseResult {
    ast: Nullable<program>;
    errs: SyntaxErr[];
}
export interface PosInfo {
    readonly overallPos: number;
    readonly line: number;
    readonly offset: number;
}
export interface RegexMatch {
    readonly kind: "RegexMatch";
    readonly negated: boolean;
    readonly literal: string;
}
export declare type EOFMatch = {
    kind: "EOF";
    negated: boolean;
};
export declare type MatchAttempt = RegexMatch | EOFMatch;
export declare class SyntaxErr {
    pos: PosInfo;
    expmatches: MatchAttempt[];
    constructor(pos: PosInfo, expmatches: MatchAttempt[]);
    toString(): string;
}
declare class ErrorTracker {
    private mxpos;
    private regexset;
    private pmatches;
    record(pos: PosInfo, result: any, att: MatchAttempt): void;
    getErr(): SyntaxErr | null;
}
export {};
