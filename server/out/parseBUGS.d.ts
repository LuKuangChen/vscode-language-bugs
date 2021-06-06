declare type Nullable<T> = T | null;
export declare enum ASTKinds {
    program = "program",
    programBody_1 = "programBody_1",
    programBody_2 = "programBody_2",
    programBody_3 = "programBody_3",
    rectangular = "rectangular",
    rectangular_$0 = "rectangular_$0",
    colSep = "colSep",
    rowSep_1 = "rowSep_1",
    rowSep_2 = "rowSep_2",
    rectangularHeader = "rectangularHeader",
    rectangularHeader_$0 = "rectangularHeader_$0",
    rectangularFooter = "rectangularFooter",
    rectangularBodyItem = "rectangularBodyItem",
    rectangularBodyItem_$0 = "rectangularBodyItem_$0",
    section = "section",
    sectionHeader_1 = "sectionHeader_1",
    sectionHeader_2 = "sectionHeader_2",
    sectionList = "sectionList",
    sectionList_$0 = "sectionList_$0",
    block = "block",
    relation_1 = "relation_1",
    relation_2 = "relation_2",
    relation_3 = "relation_3",
    relationSep = "relationSep",
    relationSep_$0 = "relationSep_$0",
    relationSepItem_1 = "relationSepItem_1",
    relationSepItem_2 = "relationSepItem_2",
    relationList = "relationList",
    relationList_$0 = "relationList_$0",
    cti = "cti",
    ctiHeader_1 = "ctiHeader_1",
    ctiHeader_2 = "ctiHeader_2",
    ctiHeader_3 = "ctiHeader_3",
    stochasticRelation = "stochasticRelation",
    deterministicRelation = "deterministicRelation",
    indexedRelation = "indexedRelation",
    blank = "blank",
    newline = "newline",
    comment = "comment",
    sep = "sep",
    sep_$0 = "sep_$0",
    sepItem_1 = "sepItem_1",
    sepItem_2 = "sepItem_2",
    exp = "exp",
    exp0_1 = "exp0_1",
    exp0_2 = "exp0_2",
    exp0_3 = "exp0_3",
    exp0_4 = "exp0_4",
    exp0_5 = "exp0_5",
    exp1 = "exp1",
    exp2_1 = "exp2_1",
    exp2_2 = "exp2_2",
    exp3_1 = "exp3_1",
    exp3_2 = "exp3_2",
    exp4_1 = "exp4_1",
    exp4_2 = "exp4_2",
    exp5_1 = "exp5_1",
    exp5_2 = "exp5_2",
    application_1 = "application_1",
    application_2 = "application_2",
    functionApplication = "functionApplication",
    vectorApplication = "vectorApplication",
    addSub_1 = "addSub_1",
    addSub_2 = "addSub_2",
    mulDiv_1 = "mulDiv_1",
    mulDiv_2 = "mulDiv_2",
    list = "list",
    structure = "structure",
    operandSep = "operandSep",
    argument = "argument",
    argumentList = "argumentList",
    argumentList_$0 = "argumentList_$0",
    argumentList_$0_$0 = "argumentList_$0_$0",
    indexList = "indexList",
    indexList_$0 = "indexList_$0",
    indexList_$0_$0 = "indexList_$0_$0",
    field = "field",
    fieldList = "fieldList",
    fieldList_$0 = "fieldList_$0",
    fieldList_$0_$0 = "fieldList_$0_$0",
    nameValueSep = "nameValueSep",
    name = "name",
    scalar = "scalar"
}
export interface program {
    kind: ASTKinds.program;
    before: sep;
    body: programBody;
    after: sep;
}
export declare type programBody = programBody_1 | programBody_2 | programBody_3;
export declare type programBody_1 = list;
export declare type programBody_2 = rectangular;
export declare type programBody_3 = sectionList;
export interface rectangular {
    kind: ASTKinds.rectangular;
    header: rectangularHeader;
    body: rectangular_$0[];
    sep: sep;
    footer: rectangularFooter;
}
export interface rectangular_$0 {
    kind: ASTKinds.rectangular_$0;
    sep: rowSep;
    item: rectangularBodyItem;
}
export declare type colSep = blank;
export declare type rowSep = rowSep_1 | rowSep_2;
export interface rowSep_1 {
    kind: ASTKinds.rowSep_1;
}
export interface rowSep_2 {
    kind: ASTKinds.rowSep_2;
    comment: comment;
}
export interface rectangularHeader {
    kind: ASTKinds.rectangularHeader;
    content: rectangularHeader_$0[];
}
export interface rectangularHeader_$0 {
    kind: ASTKinds.rectangularHeader_$0;
    sep: colSep;
    item: name;
}
export interface rectangularFooter {
    kind: ASTKinds.rectangularFooter;
}
export interface rectangularBodyItem {
    kind: ASTKinds.rectangularBodyItem;
    content: rectangularBodyItem_$0[];
}
export interface rectangularBodyItem_$0 {
    kind: ASTKinds.rectangularBodyItem_$0;
    sep: colSep;
    item: scalar;
}
export interface section {
    kind: ASTKinds.section;
    header: sectionHeader;
    sep: sep;
    body: block;
}
export declare type sectionHeader = sectionHeader_1 | sectionHeader_2;
export interface sectionHeader_1 {
    kind: ASTKinds.sectionHeader_1;
    v: string;
}
export interface sectionHeader_2 {
    kind: ASTKinds.sectionHeader_2;
    v: string;
}
export interface sectionList {
    kind: ASTKinds.sectionList;
    head: section;
    tail: sectionList_$0[];
}
export interface sectionList_$0 {
    kind: ASTKinds.sectionList_$0;
    sep: sep;
    item: section;
}
export interface block {
    kind: ASTKinds.block;
    before: relationSep;
    body: relationList;
    after: relationSep;
}
export declare type relation = relation_1 | relation_2 | relation_3;
export declare type relation_1 = stochasticRelation;
export declare type relation_2 = deterministicRelation;
export declare type relation_3 = indexedRelation;
export interface relationSep {
    kind: ASTKinds.relationSep;
    body: relationSep_$0[];
}
export interface relationSep_$0 {
    kind: ASTKinds.relationSep_$0;
    sep: blank;
    item: relationSepItem;
}
export declare type relationSepItem = relationSepItem_1 | relationSepItem_2;
export declare type relationSepItem_1 = sepItem;
export interface relationSepItem_2 {
    kind: ASTKinds.relationSepItem_2;
    v: string;
}
export interface relationList {
    kind: ASTKinds.relationList;
    head: relation;
    tail: relationList_$0[];
}
export interface relationList_$0 {
    kind: ASTKinds.relationList_$0;
    sep: relationSep;
    item: relation;
}
export interface cti {
    kind: ASTKinds.cti;
    header: ctiHeader;
    lower: Nullable<exp>;
    upper: Nullable<exp>;
}
export declare type ctiHeader = ctiHeader_1 | ctiHeader_2 | ctiHeader_3;
export interface ctiHeader_1 {
    kind: ASTKinds.ctiHeader_1;
    v: string;
}
export interface ctiHeader_2 {
    kind: ASTKinds.ctiHeader_2;
    v: string;
}
export interface ctiHeader_3 {
    kind: ASTKinds.ctiHeader_3;
    v: string;
}
export interface stochasticRelation {
    kind: ASTKinds.stochasticRelation;
    lhs: exp;
    beforeOp: sep;
    afterOp: sep;
    rhs: exp;
    cti: Nullable<cti>;
}
export interface deterministicRelation {
    kind: ASTKinds.deterministicRelation;
    lhs: exp;
    beforeOp: sep;
    afterOp: sep;
    rhs: exp;
}
export interface indexedRelation {
    kind: ASTKinds.indexedRelation;
    name: name;
    domain: exp;
    afterParenR: sep;
    body: block;
}
export interface blank {
    kind: ASTKinds.blank;
    v: string;
}
export interface newline {
    kind: ASTKinds.newline;
    v: string;
}
export interface comment {
    kind: ASTKinds.comment;
    content: string;
}
export interface sep {
    kind: ASTKinds.sep;
    body: sep_$0[];
}
export interface sep_$0 {
    kind: ASTKinds.sep_$0;
    sep: blank;
    item: sepItem;
}
export declare type sepItem = sepItem_1 | sepItem_2;
export declare type sepItem_1 = newline;
export declare type sepItem_2 = comment;
export declare type exp = exp5;
export declare type exp0 = exp0_1 | exp0_2 | exp0_3 | exp0_4 | exp0_5;
export declare type exp0_1 = scalar;
export declare type exp0_2 = structure;
export declare type exp0_3 = list;
export interface exp0_4 {
    kind: ASTKinds.exp0_4;
    before: sep;
    exp: exp5;
    after: sep;
}
export declare type exp0_5 = name;
export interface exp1 {
    kind: ASTKinds.exp1;
    base: exp0;
    applications: application[];
}
export declare type exp2 = exp2_1 | exp2_2;
export interface exp2_1 {
    kind: ASTKinds.exp2_1;
    between: sep;
    exp: exp1;
}
export declare type exp2_2 = exp1;
export declare type exp3 = exp3_1 | exp3_2;
export interface exp3_1 {
    kind: ASTKinds.exp3_1;
    left: exp3;
    beforeOp: sep;
    op: addSub;
    afterOp: sep;
    right: exp2;
}
export declare type exp3_2 = exp2;
export declare type exp4 = exp4_1 | exp4_2;
export interface exp4_1 {
    kind: ASTKinds.exp4_1;
    left: exp4;
    beforeOp: sep;
    op: mulDiv;
    afterOp: sep;
    right: exp3;
}
export declare type exp4_2 = exp3;
export declare type exp5 = exp5_1 | exp5_2;
export interface exp5_1 {
    kind: ASTKinds.exp5_1;
    left: exp5;
    beforeOp: sep;
    afterOp: sep;
    right: exp4;
}
export declare type exp5_2 = exp4;
export declare type application = application_1 | application_2;
export declare type application_1 = functionApplication;
export declare type application_2 = vectorApplication;
export interface functionApplication {
    kind: ASTKinds.functionApplication;
    beforeParen: sep;
    beginArgs: sep;
    operands: argumentList;
    endArgs: sep;
}
export interface vectorApplication {
    kind: ASTKinds.vectorApplication;
    beforeParen: sep;
    beginInds: sep;
    operands: indexList;
    endInds: sep;
}
export declare type addSub = addSub_1 | addSub_2;
export interface addSub_1 {
    kind: ASTKinds.addSub_1;
    v: string;
}
export interface addSub_2 {
    kind: ASTKinds.addSub_2;
    v: string;
}
export declare type mulDiv = mulDiv_1 | mulDiv_2;
export interface mulDiv_1 {
    kind: ASTKinds.mulDiv_1;
    v: string;
}
export interface mulDiv_2 {
    kind: ASTKinds.mulDiv_2;
    v: string;
}
export interface list {
    kind: ASTKinds.list;
    beforeFields: sep;
    operands: fieldList;
    afterFields: sep;
}
export interface structure {
    kind: ASTKinds.structure;
    begin: sep;
    sepDotData: sep;
    eqData: nameValueSep;
    data: exp;
    sepDotDim: sep;
    eqDim: nameValueSep;
    dim: exp;
    end: sep;
}
export interface operandSep {
    kind: ASTKinds.operandSep;
    before: sep;
    after: sep;
}
export declare type argument = exp;
export interface argumentList {
    kind: ASTKinds.argumentList;
    content: Nullable<argumentList_$0>;
}
export interface argumentList_$0 {
    kind: ASTKinds.argumentList_$0;
    first: argument;
    rest: argumentList_$0_$0[];
}
export interface argumentList_$0_$0 {
    kind: ASTKinds.argumentList_$0_$0;
    sep: operandSep;
    item: argument;
}
export interface indexList {
    kind: ASTKinds.indexList;
    content: Nullable<indexList_$0>;
}
export interface indexList_$0 {
    kind: ASTKinds.indexList_$0;
    first: Nullable<exp>;
    rest: indexList_$0_$0[];
}
export interface indexList_$0_$0 {
    kind: ASTKinds.indexList_$0_$0;
    sep: operandSep;
    item: Nullable<exp>;
}
export interface field {
    kind: ASTKinds.field;
    name: name;
    sep: nameValueSep;
    value: exp;
}
export interface fieldList {
    kind: ASTKinds.fieldList;
    content: Nullable<fieldList_$0>;
}
export interface fieldList_$0 {
    kind: ASTKinds.fieldList_$0;
    first: field;
    rest: fieldList_$0_$0[];
}
export interface fieldList_$0_$0 {
    kind: ASTKinds.fieldList_$0_$0;
    sep: operandSep;
    item: field;
}
export interface nameValueSep {
    kind: ASTKinds.nameValueSep;
    before: sep;
    after: sep;
}
export interface name {
    kind: ASTKinds.name;
    from: PosInfo;
    value: string;
    to: PosInfo;
}
export interface scalar {
    kind: ASTKinds.scalar;
    value: string;
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
    protected $scope$exp3$memo: Map<number, [Nullable<exp3>, PosInfo]>;
    protected $scope$exp4$memo: Map<number, [Nullable<exp4>, PosInfo]>;
    protected $scope$exp5$memo: Map<number, [Nullable<exp5>, PosInfo]>;
    matchprogram($$dpth: number, $$cr?: ErrorTracker): Nullable<program>;
    matchprogramBody($$dpth: number, $$cr?: ErrorTracker): Nullable<programBody>;
    matchprogramBody_1($$dpth: number, $$cr?: ErrorTracker): Nullable<programBody_1>;
    matchprogramBody_2($$dpth: number, $$cr?: ErrorTracker): Nullable<programBody_2>;
    matchprogramBody_3($$dpth: number, $$cr?: ErrorTracker): Nullable<programBody_3>;
    matchrectangular($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangular>;
    matchrectangular_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangular_$0>;
    matchcolSep($$dpth: number, $$cr?: ErrorTracker): Nullable<colSep>;
    matchrowSep($$dpth: number, $$cr?: ErrorTracker): Nullable<rowSep>;
    matchrowSep_1($$dpth: number, $$cr?: ErrorTracker): Nullable<rowSep_1>;
    matchrowSep_2($$dpth: number, $$cr?: ErrorTracker): Nullable<rowSep_2>;
    matchrectangularHeader($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangularHeader>;
    matchrectangularHeader_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangularHeader_$0>;
    matchrectangularFooter($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangularFooter>;
    matchrectangularBodyItem($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangularBodyItem>;
    matchrectangularBodyItem_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<rectangularBodyItem_$0>;
    matchsection($$dpth: number, $$cr?: ErrorTracker): Nullable<section>;
    matchsectionHeader($$dpth: number, $$cr?: ErrorTracker): Nullable<sectionHeader>;
    matchsectionHeader_1($$dpth: number, $$cr?: ErrorTracker): Nullable<sectionHeader_1>;
    matchsectionHeader_2($$dpth: number, $$cr?: ErrorTracker): Nullable<sectionHeader_2>;
    matchsectionList($$dpth: number, $$cr?: ErrorTracker): Nullable<sectionList>;
    matchsectionList_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<sectionList_$0>;
    matchblock($$dpth: number, $$cr?: ErrorTracker): Nullable<block>;
    matchrelation($$dpth: number, $$cr?: ErrorTracker): Nullable<relation>;
    matchrelation_1($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_1>;
    matchrelation_2($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_2>;
    matchrelation_3($$dpth: number, $$cr?: ErrorTracker): Nullable<relation_3>;
    matchrelationSep($$dpth: number, $$cr?: ErrorTracker): Nullable<relationSep>;
    matchrelationSep_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<relationSep_$0>;
    matchrelationSepItem($$dpth: number, $$cr?: ErrorTracker): Nullable<relationSepItem>;
    matchrelationSepItem_1($$dpth: number, $$cr?: ErrorTracker): Nullable<relationSepItem_1>;
    matchrelationSepItem_2($$dpth: number, $$cr?: ErrorTracker): Nullable<relationSepItem_2>;
    matchrelationList($$dpth: number, $$cr?: ErrorTracker): Nullable<relationList>;
    matchrelationList_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<relationList_$0>;
    matchcti($$dpth: number, $$cr?: ErrorTracker): Nullable<cti>;
    matchctiHeader($$dpth: number, $$cr?: ErrorTracker): Nullable<ctiHeader>;
    matchctiHeader_1($$dpth: number, $$cr?: ErrorTracker): Nullable<ctiHeader_1>;
    matchctiHeader_2($$dpth: number, $$cr?: ErrorTracker): Nullable<ctiHeader_2>;
    matchctiHeader_3($$dpth: number, $$cr?: ErrorTracker): Nullable<ctiHeader_3>;
    matchstochasticRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<stochasticRelation>;
    matchdeterministicRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<deterministicRelation>;
    matchindexedRelation($$dpth: number, $$cr?: ErrorTracker): Nullable<indexedRelation>;
    matchblank($$dpth: number, $$cr?: ErrorTracker): Nullable<blank>;
    matchnewline($$dpth: number, $$cr?: ErrorTracker): Nullable<newline>;
    matchcomment($$dpth: number, $$cr?: ErrorTracker): Nullable<comment>;
    matchsep($$dpth: number, $$cr?: ErrorTracker): Nullable<sep>;
    matchsep_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<sep_$0>;
    matchsepItem($$dpth: number, $$cr?: ErrorTracker): Nullable<sepItem>;
    matchsepItem_1($$dpth: number, $$cr?: ErrorTracker): Nullable<sepItem_1>;
    matchsepItem_2($$dpth: number, $$cr?: ErrorTracker): Nullable<sepItem_2>;
    matchexp($$dpth: number, $$cr?: ErrorTracker): Nullable<exp>;
    matchexp0($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0>;
    matchexp0_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_1>;
    matchexp0_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_2>;
    matchexp0_3($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_3>;
    matchexp0_4($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_4>;
    matchexp0_5($$dpth: number, $$cr?: ErrorTracker): Nullable<exp0_5>;
    matchexp1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp1>;
    matchexp2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2>;
    matchexp2_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2_1>;
    matchexp2_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp2_2>;
    matchexp3($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3>;
    matchexp3_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3_1>;
    matchexp3_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp3_2>;
    matchexp4($$dpth: number, $$cr?: ErrorTracker): Nullable<exp4>;
    matchexp4_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp4_1>;
    matchexp4_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp4_2>;
    matchexp5($$dpth: number, $$cr?: ErrorTracker): Nullable<exp5>;
    matchexp5_1($$dpth: number, $$cr?: ErrorTracker): Nullable<exp5_1>;
    matchexp5_2($$dpth: number, $$cr?: ErrorTracker): Nullable<exp5_2>;
    matchapplication($$dpth: number, $$cr?: ErrorTracker): Nullable<application>;
    matchapplication_1($$dpth: number, $$cr?: ErrorTracker): Nullable<application_1>;
    matchapplication_2($$dpth: number, $$cr?: ErrorTracker): Nullable<application_2>;
    matchfunctionApplication($$dpth: number, $$cr?: ErrorTracker): Nullable<functionApplication>;
    matchvectorApplication($$dpth: number, $$cr?: ErrorTracker): Nullable<vectorApplication>;
    matchaddSub($$dpth: number, $$cr?: ErrorTracker): Nullable<addSub>;
    matchaddSub_1($$dpth: number, $$cr?: ErrorTracker): Nullable<addSub_1>;
    matchaddSub_2($$dpth: number, $$cr?: ErrorTracker): Nullable<addSub_2>;
    matchmulDiv($$dpth: number, $$cr?: ErrorTracker): Nullable<mulDiv>;
    matchmulDiv_1($$dpth: number, $$cr?: ErrorTracker): Nullable<mulDiv_1>;
    matchmulDiv_2($$dpth: number, $$cr?: ErrorTracker): Nullable<mulDiv_2>;
    matchlist($$dpth: number, $$cr?: ErrorTracker): Nullable<list>;
    matchstructure($$dpth: number, $$cr?: ErrorTracker): Nullable<structure>;
    matchoperandSep($$dpth: number, $$cr?: ErrorTracker): Nullable<operandSep>;
    matchargument($$dpth: number, $$cr?: ErrorTracker): Nullable<argument>;
    matchargumentList($$dpth: number, $$cr?: ErrorTracker): Nullable<argumentList>;
    matchargumentList_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<argumentList_$0>;
    matchargumentList_$0_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<argumentList_$0_$0>;
    matchindexList($$dpth: number, $$cr?: ErrorTracker): Nullable<indexList>;
    matchindexList_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<indexList_$0>;
    matchindexList_$0_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<indexList_$0_$0>;
    matchfield($$dpth: number, $$cr?: ErrorTracker): Nullable<field>;
    matchfieldList($$dpth: number, $$cr?: ErrorTracker): Nullable<fieldList>;
    matchfieldList_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<fieldList_$0>;
    matchfieldList_$0_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<fieldList_$0_$0>;
    matchnameValueSep($$dpth: number, $$cr?: ErrorTracker): Nullable<nameValueSep>;
    matchname($$dpth: number, $$cr?: ErrorTracker): Nullable<name>;
    matchscalar($$dpth: number, $$cr?: ErrorTracker): Nullable<scalar>;
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
