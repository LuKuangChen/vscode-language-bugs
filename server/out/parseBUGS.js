"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxErr = exports.parse = exports.Parser = exports.ASTKinds = void 0;
var ASTKinds;
(function (ASTKinds) {
    ASTKinds["program"] = "program";
    ASTKinds["programBody_1"] = "programBody_1";
    ASTKinds["programBody_2"] = "programBody_2";
    ASTKinds["programBody_3"] = "programBody_3";
    ASTKinds["rectangular"] = "rectangular";
    ASTKinds["rectangular_$0"] = "rectangular_$0";
    ASTKinds["colSep"] = "colSep";
    ASTKinds["rowSep_1"] = "rowSep_1";
    ASTKinds["rowSep_2"] = "rowSep_2";
    ASTKinds["rectangularHeader"] = "rectangularHeader";
    ASTKinds["rectangularHeader_$0"] = "rectangularHeader_$0";
    ASTKinds["rectangularFooter"] = "rectangularFooter";
    ASTKinds["rectangularBodyItem"] = "rectangularBodyItem";
    ASTKinds["rectangularBodyItem_$0"] = "rectangularBodyItem_$0";
    ASTKinds["section"] = "section";
    ASTKinds["sectionHeader_1"] = "sectionHeader_1";
    ASTKinds["sectionHeader_2"] = "sectionHeader_2";
    ASTKinds["sectionList"] = "sectionList";
    ASTKinds["sectionList_$0"] = "sectionList_$0";
    ASTKinds["block"] = "block";
    ASTKinds["relation_1"] = "relation_1";
    ASTKinds["relation_2"] = "relation_2";
    ASTKinds["relation_3"] = "relation_3";
    ASTKinds["relationSep"] = "relationSep";
    ASTKinds["relationSep_$0"] = "relationSep_$0";
    ASTKinds["relationSepItem_1"] = "relationSepItem_1";
    ASTKinds["relationSepItem_2"] = "relationSepItem_2";
    ASTKinds["relationList"] = "relationList";
    ASTKinds["relationList_$0"] = "relationList_$0";
    ASTKinds["cti"] = "cti";
    ASTKinds["ctiHeader_1"] = "ctiHeader_1";
    ASTKinds["ctiHeader_2"] = "ctiHeader_2";
    ASTKinds["ctiHeader_3"] = "ctiHeader_3";
    ASTKinds["stochasticRelation"] = "stochasticRelation";
    ASTKinds["deterministicRelation"] = "deterministicRelation";
    ASTKinds["indexedRelation"] = "indexedRelation";
    ASTKinds["blank"] = "blank";
    ASTKinds["newline"] = "newline";
    ASTKinds["comment"] = "comment";
    ASTKinds["sep"] = "sep";
    ASTKinds["sep_$0"] = "sep_$0";
    ASTKinds["sepItem_1"] = "sepItem_1";
    ASTKinds["sepItem_2"] = "sepItem_2";
    ASTKinds["exp"] = "exp";
    ASTKinds["exp0_1"] = "exp0_1";
    ASTKinds["exp0_2"] = "exp0_2";
    ASTKinds["exp0_3"] = "exp0_3";
    ASTKinds["exp0_4"] = "exp0_4";
    ASTKinds["exp0_5"] = "exp0_5";
    ASTKinds["exp1"] = "exp1";
    ASTKinds["exp2_1"] = "exp2_1";
    ASTKinds["exp2_2"] = "exp2_2";
    ASTKinds["exp3_1"] = "exp3_1";
    ASTKinds["exp3_2"] = "exp3_2";
    ASTKinds["exp4_1"] = "exp4_1";
    ASTKinds["exp4_2"] = "exp4_2";
    ASTKinds["exp5_1"] = "exp5_1";
    ASTKinds["exp5_2"] = "exp5_2";
    ASTKinds["application_1"] = "application_1";
    ASTKinds["application_2"] = "application_2";
    ASTKinds["functionApplication"] = "functionApplication";
    ASTKinds["vectorApplication"] = "vectorApplication";
    ASTKinds["addSub_1"] = "addSub_1";
    ASTKinds["addSub_2"] = "addSub_2";
    ASTKinds["mulDiv_1"] = "mulDiv_1";
    ASTKinds["mulDiv_2"] = "mulDiv_2";
    ASTKinds["list"] = "list";
    ASTKinds["structure"] = "structure";
    ASTKinds["operandSep"] = "operandSep";
    ASTKinds["argument"] = "argument";
    ASTKinds["argumentList"] = "argumentList";
    ASTKinds["argumentList_$0"] = "argumentList_$0";
    ASTKinds["argumentList_$0_$0"] = "argumentList_$0_$0";
    ASTKinds["indexList"] = "indexList";
    ASTKinds["indexList_$0"] = "indexList_$0";
    ASTKinds["indexList_$0_$0"] = "indexList_$0_$0";
    ASTKinds["field"] = "field";
    ASTKinds["fieldList"] = "fieldList";
    ASTKinds["fieldList_$0"] = "fieldList_$0";
    ASTKinds["fieldList_$0_$0"] = "fieldList_$0_$0";
    ASTKinds["nameValueSep"] = "nameValueSep";
    ASTKinds["name"] = "name";
    ASTKinds["scalar"] = "scalar";
})(ASTKinds = exports.ASTKinds || (exports.ASTKinds = {}));
class Parser {
    constructor(input) {
        this.negating = false;
        this.memoSafe = true;
        this.$scope$exp3$memo = new Map();
        this.$scope$exp4$memo = new Map();
        this.$scope$exp5$memo = new Map();
        this.pos = { overallPos: 0, line: 1, offset: 0 };
        this.input = input;
    }
    reset(pos) {
        this.pos = pos;
    }
    finished() {
        return this.pos.overallPos === this.input.length;
    }
    clearMemos() {
        this.$scope$exp3$memo.clear();
        this.$scope$exp4$memo.clear();
        this.$scope$exp5$memo.clear();
    }
    matchprogram($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$before;
            let $scope$body;
            let $scope$after;
            let $$res = null;
            if (true
                && ($scope$before = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$body = this.matchprogramBody($$dpth + 1, $$cr)) !== null
                && ($scope$after = this.matchsep($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.program, before: $scope$before, body: $scope$body, after: $scope$after };
            }
            return $$res;
        });
    }
    matchprogramBody($$dpth, $$cr) {
        return this.choice([
            () => this.matchprogramBody_1($$dpth + 1, $$cr),
            () => this.matchprogramBody_2($$dpth + 1, $$cr),
            () => this.matchprogramBody_3($$dpth + 1, $$cr),
        ]);
    }
    matchprogramBody_1($$dpth, $$cr) {
        return this.matchlist($$dpth + 1, $$cr);
    }
    matchprogramBody_2($$dpth, $$cr) {
        return this.matchrectangular($$dpth + 1, $$cr);
    }
    matchprogramBody_3($$dpth, $$cr) {
        return this.matchsectionList($$dpth + 1, $$cr);
    }
    matchrectangular($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$header;
            let $scope$body;
            let $scope$sep;
            let $scope$footer;
            let $$res = null;
            if (true
                && ($scope$header = this.matchrectangularHeader($$dpth + 1, $$cr)) !== null
                && ($scope$body = this.loop(() => this.matchrectangular_$0($$dpth + 1, $$cr), true)) !== null
                && ($scope$sep = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$footer = this.matchrectangularFooter($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.rectangular, header: $scope$header, body: $scope$body, sep: $scope$sep, footer: $scope$footer };
            }
            return $$res;
        });
    }
    matchrectangular_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchrowSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchrectangularBodyItem($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.rectangular_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchcolSep($$dpth, $$cr) {
        return this.matchblank($$dpth + 1, $$cr);
    }
    matchrowSep($$dpth, $$cr) {
        return this.choice([
            () => this.matchrowSep_1($$dpth + 1, $$cr),
            () => this.matchrowSep_2($$dpth + 1, $$cr),
        ]);
    }
    matchrowSep_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $$res = null;
            if (true
                && this.matchblank($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:[\n])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.rowSep_1, };
            }
            return $$res;
        });
    }
    matchrowSep_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$comment;
            let $$res = null;
            if (true
                && this.matchblank($$dpth + 1, $$cr) !== null
                && ($scope$comment = this.matchcomment($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.rowSep_2, comment: $scope$comment };
            }
            return $$res;
        });
    }
    matchrectangularHeader($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && ($scope$content = this.loop(() => this.matchrectangularHeader_$0($$dpth + 1, $$cr), false)) !== null) {
                $$res = { kind: ASTKinds.rectangularHeader, content: $scope$content };
            }
            return $$res;
        });
    }
    matchrectangularHeader_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchcolSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchname($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\[\])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.rectangularHeader_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchrectangularFooter($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $$res = null;
            if (true
                && this.matchcolSep($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:END)`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.rectangularFooter, };
            }
            return $$res;
        });
    }
    matchrectangularBodyItem($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && ($scope$content = this.loop(() => this.matchrectangularBodyItem_$0($$dpth + 1, $$cr), false)) !== null) {
                $$res = { kind: ASTKinds.rectangularBodyItem, content: $scope$content };
            }
            return $$res;
        });
    }
    matchrectangularBodyItem_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchcolSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchscalar($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.rectangularBodyItem_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchsection($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$header;
            let $scope$sep;
            let $scope$body;
            let $$res = null;
            if (true
                && ($scope$header = this.matchsectionHeader($$dpth + 1, $$cr)) !== null
                && ($scope$sep = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$body = this.matchblock($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.section, header: $scope$header, sep: $scope$sep, body: $scope$body };
            }
            return $$res;
        });
    }
    matchsectionHeader($$dpth, $$cr) {
        return this.choice([
            () => this.matchsectionHeader_1($$dpth + 1, $$cr),
            () => this.matchsectionHeader_2($$dpth + 1, $$cr),
        ]);
    }
    matchsectionHeader_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:model)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.sectionHeader_1, v: $scope$v };
            }
            return $$res;
        });
    }
    matchsectionHeader_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:data)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.sectionHeader_2, v: $scope$v };
            }
            return $$res;
        });
    }
    matchsectionList($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$head;
            let $scope$tail;
            let $$res = null;
            if (true
                && ($scope$head = this.matchsection($$dpth + 1, $$cr)) !== null
                && ($scope$tail = this.loop(() => this.matchsectionList_$0($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.sectionList, head: $scope$head, tail: $scope$tail };
            }
            return $$res;
        });
    }
    matchsectionList_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchsection($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.sectionList_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchblock($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$before;
            let $scope$body;
            let $scope$after;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:{)`, $$dpth + 1, $$cr) !== null
                && ($scope$before = this.matchrelationSep($$dpth + 1, $$cr)) !== null
                && ($scope$body = this.matchrelationList($$dpth + 1, $$cr)) !== null
                && ($scope$after = this.matchrelationSep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:})`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.block, before: $scope$before, body: $scope$body, after: $scope$after };
            }
            return $$res;
        });
    }
    matchrelation($$dpth, $$cr) {
        return this.choice([
            () => this.matchrelation_1($$dpth + 1, $$cr),
            () => this.matchrelation_2($$dpth + 1, $$cr),
            () => this.matchrelation_3($$dpth + 1, $$cr),
        ]);
    }
    matchrelation_1($$dpth, $$cr) {
        return this.matchstochasticRelation($$dpth + 1, $$cr);
    }
    matchrelation_2($$dpth, $$cr) {
        return this.matchdeterministicRelation($$dpth + 1, $$cr);
    }
    matchrelation_3($$dpth, $$cr) {
        return this.matchindexedRelation($$dpth + 1, $$cr);
    }
    matchrelationSep($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$body;
            let $$res = null;
            if (true
                && ($scope$body = this.loop(() => this.matchrelationSep_$0($$dpth + 1, $$cr), true)) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.relationSep, body: $scope$body };
            }
            return $$res;
        });
    }
    matchrelationSep_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchblank($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchrelationSepItem($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.relationSep_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchrelationSepItem($$dpth, $$cr) {
        return this.choice([
            () => this.matchrelationSepItem_1($$dpth + 1, $$cr),
            () => this.matchrelationSepItem_2($$dpth + 1, $$cr),
        ]);
    }
    matchrelationSepItem_1($$dpth, $$cr) {
        return this.matchsepItem($$dpth + 1, $$cr);
    }
    matchrelationSepItem_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:;)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.relationSepItem_2, v: $scope$v };
            }
            return $$res;
        });
    }
    matchrelationList($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$head;
            let $scope$tail;
            let $$res = null;
            if (true
                && ($scope$head = this.matchrelation($$dpth + 1, $$cr)) !== null
                && ($scope$tail = this.loop(() => this.matchrelationList_$0($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.relationList, head: $scope$head, tail: $scope$tail };
            }
            return $$res;
        });
    }
    matchrelationList_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchrelationSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchrelation($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.relationList_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchcti($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$header;
            let $scope$lower;
            let $scope$upper;
            let $$res = null;
            if (true
                && this.matchsep($$dpth + 1, $$cr) !== null
                && ($scope$header = this.matchctiHeader($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:[(])`, $$dpth + 1, $$cr) !== null
                && this.matchsep($$dpth + 1, $$cr) !== null
                && (($scope$lower = this.matchexp($$dpth + 1, $$cr)) || true)
                && this.regexAccept(String.raw `(?:[,])`, $$dpth + 1, $$cr) !== null
                && this.matchsep($$dpth + 1, $$cr) !== null
                && (($scope$upper = this.matchexp($$dpth + 1, $$cr)) || true)
                && this.regexAccept(String.raw `(?:[)])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.cti, header: $scope$header, lower: $scope$lower, upper: $scope$upper };
            }
            return $$res;
        });
    }
    matchctiHeader($$dpth, $$cr) {
        return this.choice([
            () => this.matchctiHeader_1($$dpth + 1, $$cr),
            () => this.matchctiHeader_2($$dpth + 1, $$cr),
            () => this.matchctiHeader_3($$dpth + 1, $$cr),
        ]);
    }
    matchctiHeader_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:C)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.ctiHeader_1, v: $scope$v };
            }
            return $$res;
        });
    }
    matchctiHeader_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:T)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.ctiHeader_2, v: $scope$v };
            }
            return $$res;
        });
    }
    matchctiHeader_3($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:I)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.ctiHeader_3, v: $scope$v };
            }
            return $$res;
        });
    }
    matchstochasticRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$lhs;
            let $scope$beforeOp;
            let $scope$afterOp;
            let $scope$rhs;
            let $scope$cti;
            let $$res = null;
            if (true
                && ($scope$lhs = this.matchexp($$dpth + 1, $$cr)) !== null
                && ($scope$beforeOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:~)`, $$dpth + 1, $$cr) !== null
                && ($scope$afterOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$rhs = this.matchexp($$dpth + 1, $$cr)) !== null
                && (($scope$cti = this.matchcti($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.stochasticRelation, lhs: $scope$lhs, beforeOp: $scope$beforeOp, afterOp: $scope$afterOp, rhs: $scope$rhs, cti: $scope$cti };
            }
            return $$res;
        });
    }
    matchdeterministicRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$lhs;
            let $scope$beforeOp;
            let $scope$afterOp;
            let $scope$rhs;
            let $$res = null;
            if (true
                && ($scope$lhs = this.matchexp($$dpth + 1, $$cr)) !== null
                && ($scope$beforeOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:<-)`, $$dpth + 1, $$cr) !== null
                && ($scope$afterOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$rhs = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.deterministicRelation, lhs: $scope$lhs, beforeOp: $scope$beforeOp, afterOp: $scope$afterOp, rhs: $scope$rhs };
            }
            return $$res;
        });
    }
    matchindexedRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$name;
            let $scope$domain;
            let $scope$afterParenR;
            let $scope$body;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:for)`, $$dpth + 1, $$cr) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null
                && ($scope$name = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:in)`, $$dpth + 1, $$cr) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null
                && ($scope$domain = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null
                && ($scope$afterParenR = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$body = this.matchblock($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.indexedRelation, name: $scope$name, domain: $scope$domain, afterParenR: $scope$afterParenR, body: $scope$body };
            }
            return $$res;
        });
    }
    matchblank($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:[^\S\n]*)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.blank, v: $scope$v };
            }
            return $$res;
        });
    }
    matchnewline($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:[\n])`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.newline, v: $scope$v };
            }
            return $$res;
        });
    }
    matchcomment($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:[#])`, $$dpth + 1, $$cr) !== null
                && ($scope$content = this.regexAccept(String.raw `(?:[^\n]*)`, $$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:[\n])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.comment, content: $scope$content };
            }
            return $$res;
        });
    }
    matchsep($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$body;
            let $$res = null;
            if (true
                && ($scope$body = this.loop(() => this.matchsep_$0($$dpth + 1, $$cr), true)) !== null
                && this.matchblank($$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.sep, body: $scope$body };
            }
            return $$res;
        });
    }
    matchsep_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchblank($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchsepItem($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.sep_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchsepItem($$dpth, $$cr) {
        return this.choice([
            () => this.matchsepItem_1($$dpth + 1, $$cr),
            () => this.matchsepItem_2($$dpth + 1, $$cr),
        ]);
    }
    matchsepItem_1($$dpth, $$cr) {
        return this.matchnewline($$dpth + 1, $$cr);
    }
    matchsepItem_2($$dpth, $$cr) {
        return this.matchcomment($$dpth + 1, $$cr);
    }
    matchexp($$dpth, $$cr) {
        return this.matchexp5($$dpth + 1, $$cr);
    }
    matchexp0($$dpth, $$cr) {
        return this.choice([
            () => this.matchexp0_1($$dpth + 1, $$cr),
            () => this.matchexp0_2($$dpth + 1, $$cr),
            () => this.matchexp0_3($$dpth + 1, $$cr),
            () => this.matchexp0_4($$dpth + 1, $$cr),
            () => this.matchexp0_5($$dpth + 1, $$cr),
        ]);
    }
    matchexp0_1($$dpth, $$cr) {
        return this.matchscalar($$dpth + 1, $$cr);
    }
    matchexp0_2($$dpth, $$cr) {
        return this.matchstructure($$dpth + 1, $$cr);
    }
    matchexp0_3($$dpth, $$cr) {
        return this.matchlist($$dpth + 1, $$cr);
    }
    matchexp0_4($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$before;
            let $scope$exp;
            let $scope$after;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && ($scope$before = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$exp = this.matchexp5($$dpth + 1, $$cr)) !== null
                && ($scope$after = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.exp0_4, before: $scope$before, exp: $scope$exp, after: $scope$after };
            }
            return $$res;
        });
    }
    matchexp0_5($$dpth, $$cr) {
        return this.matchname($$dpth + 1, $$cr);
    }
    matchexp1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$base;
            let $scope$applications;
            let $$res = null;
            if (true
                && ($scope$base = this.matchexp0($$dpth + 1, $$cr)) !== null
                && ($scope$applications = this.loop(() => this.matchapplication($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.exp1, base: $scope$base, applications: $scope$applications };
            }
            return $$res;
        });
    }
    matchexp2($$dpth, $$cr) {
        return this.choice([
            () => this.matchexp2_1($$dpth + 1, $$cr),
            () => this.matchexp2_2($$dpth + 1, $$cr),
        ]);
    }
    matchexp2_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$between;
            let $scope$exp;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:-)`, $$dpth + 1, $$cr) !== null
                && ($scope$between = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$exp = this.matchexp1($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp2_1, between: $scope$between, exp: $scope$exp };
            }
            return $$res;
        });
    }
    matchexp2_2($$dpth, $$cr) {
        return this.matchexp1($$dpth + 1, $$cr);
    }
    matchexp3($$dpth, $$cr) {
        const fn = () => {
            return this.choice([
                () => this.matchexp3_1($$dpth + 1, $$cr),
                () => this.matchexp3_2($$dpth + 1, $$cr),
            ]);
        };
        const $scope$pos = this.mark();
        const memo = this.$scope$exp3$memo.get($scope$pos.overallPos);
        if (memo !== undefined) {
            this.reset(memo[1]);
            return memo[0];
        }
        const $scope$oldMemoSafe = this.memoSafe;
        this.memoSafe = false;
        this.$scope$exp3$memo.set($scope$pos.overallPos, [null, $scope$pos]);
        let lastRes = null;
        let lastPos = $scope$pos;
        for (;;) {
            this.reset($scope$pos);
            const res = fn();
            const end = this.mark();
            if (end.overallPos <= lastPos.overallPos)
                break;
            lastRes = res;
            lastPos = end;
            this.$scope$exp3$memo.set($scope$pos.overallPos, [lastRes, lastPos]);
        }
        this.reset(lastPos);
        this.memoSafe = $scope$oldMemoSafe;
        return lastRes;
    }
    matchexp3_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$beforeOp;
            let $scope$op;
            let $scope$afterOp;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp3($$dpth + 1, $$cr)) !== null
                && ($scope$beforeOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$op = this.matchaddSub($$dpth + 1, $$cr)) !== null
                && ($scope$afterOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$right = this.matchexp2($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp3_1, left: $scope$left, beforeOp: $scope$beforeOp, op: $scope$op, afterOp: $scope$afterOp, right: $scope$right };
            }
            return $$res;
        });
    }
    matchexp3_2($$dpth, $$cr) {
        return this.matchexp2($$dpth + 1, $$cr);
    }
    matchexp4($$dpth, $$cr) {
        const fn = () => {
            return this.choice([
                () => this.matchexp4_1($$dpth + 1, $$cr),
                () => this.matchexp4_2($$dpth + 1, $$cr),
            ]);
        };
        const $scope$pos = this.mark();
        const memo = this.$scope$exp4$memo.get($scope$pos.overallPos);
        if (memo !== undefined) {
            this.reset(memo[1]);
            return memo[0];
        }
        const $scope$oldMemoSafe = this.memoSafe;
        this.memoSafe = false;
        this.$scope$exp4$memo.set($scope$pos.overallPos, [null, $scope$pos]);
        let lastRes = null;
        let lastPos = $scope$pos;
        for (;;) {
            this.reset($scope$pos);
            const res = fn();
            const end = this.mark();
            if (end.overallPos <= lastPos.overallPos)
                break;
            lastRes = res;
            lastPos = end;
            this.$scope$exp4$memo.set($scope$pos.overallPos, [lastRes, lastPos]);
        }
        this.reset(lastPos);
        this.memoSafe = $scope$oldMemoSafe;
        return lastRes;
    }
    matchexp4_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$beforeOp;
            let $scope$op;
            let $scope$afterOp;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp4($$dpth + 1, $$cr)) !== null
                && ($scope$beforeOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$op = this.matchmulDiv($$dpth + 1, $$cr)) !== null
                && ($scope$afterOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$right = this.matchexp3($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp4_1, left: $scope$left, beforeOp: $scope$beforeOp, op: $scope$op, afterOp: $scope$afterOp, right: $scope$right };
            }
            return $$res;
        });
    }
    matchexp4_2($$dpth, $$cr) {
        return this.matchexp3($$dpth + 1, $$cr);
    }
    matchexp5($$dpth, $$cr) {
        const fn = () => {
            return this.choice([
                () => this.matchexp5_1($$dpth + 1, $$cr),
                () => this.matchexp5_2($$dpth + 1, $$cr),
            ]);
        };
        const $scope$pos = this.mark();
        const memo = this.$scope$exp5$memo.get($scope$pos.overallPos);
        if (memo !== undefined) {
            this.reset(memo[1]);
            return memo[0];
        }
        const $scope$oldMemoSafe = this.memoSafe;
        this.memoSafe = false;
        this.$scope$exp5$memo.set($scope$pos.overallPos, [null, $scope$pos]);
        let lastRes = null;
        let lastPos = $scope$pos;
        for (;;) {
            this.reset($scope$pos);
            const res = fn();
            const end = this.mark();
            if (end.overallPos <= lastPos.overallPos)
                break;
            lastRes = res;
            lastPos = end;
            this.$scope$exp5$memo.set($scope$pos.overallPos, [lastRes, lastPos]);
        }
        this.reset(lastPos);
        this.memoSafe = $scope$oldMemoSafe;
        return lastRes;
    }
    matchexp5_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$beforeOp;
            let $scope$afterOp;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp5($$dpth + 1, $$cr)) !== null
                && ($scope$beforeOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?::)`, $$dpth + 1, $$cr) !== null
                && ($scope$afterOp = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$right = this.matchexp4($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp5_1, left: $scope$left, beforeOp: $scope$beforeOp, afterOp: $scope$afterOp, right: $scope$right };
            }
            return $$res;
        });
    }
    matchexp5_2($$dpth, $$cr) {
        return this.matchexp4($$dpth + 1, $$cr);
    }
    matchapplication($$dpth, $$cr) {
        return this.choice([
            () => this.matchapplication_1($$dpth + 1, $$cr),
            () => this.matchapplication_2($$dpth + 1, $$cr),
        ]);
    }
    matchapplication_1($$dpth, $$cr) {
        return this.matchfunctionApplication($$dpth + 1, $$cr);
    }
    matchapplication_2($$dpth, $$cr) {
        return this.matchvectorApplication($$dpth + 1, $$cr);
    }
    matchfunctionApplication($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$beforeParen;
            let $scope$beginArgs;
            let $scope$operands;
            let $scope$endArgs;
            let $$res = null;
            if (true
                && ($scope$beforeParen = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && ($scope$beginArgs = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$operands = this.matchargumentList($$dpth + 1, $$cr)) !== null
                && ($scope$endArgs = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.functionApplication, beforeParen: $scope$beforeParen, beginArgs: $scope$beginArgs, operands: $scope$operands, endArgs: $scope$endArgs };
            }
            return $$res;
        });
    }
    matchvectorApplication($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$beforeParen;
            let $scope$beginInds;
            let $scope$operands;
            let $scope$endInds;
            let $$res = null;
            if (true
                && ($scope$beforeParen = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\[)`, $$dpth + 1, $$cr) !== null
                && ($scope$beginInds = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$operands = this.matchindexList($$dpth + 1, $$cr)) !== null
                && ($scope$endInds = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.vectorApplication, beforeParen: $scope$beforeParen, beginInds: $scope$beginInds, operands: $scope$operands, endInds: $scope$endInds };
            }
            return $$res;
        });
    }
    matchaddSub($$dpth, $$cr) {
        return this.choice([
            () => this.matchaddSub_1($$dpth + 1, $$cr),
            () => this.matchaddSub_2($$dpth + 1, $$cr),
        ]);
    }
    matchaddSub_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:\+)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.addSub_1, v: $scope$v };
            }
            return $$res;
        });
    }
    matchaddSub_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:-)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.addSub_2, v: $scope$v };
            }
            return $$res;
        });
    }
    matchmulDiv($$dpth, $$cr) {
        return this.choice([
            () => this.matchmulDiv_1($$dpth + 1, $$cr),
            () => this.matchmulDiv_2($$dpth + 1, $$cr),
        ]);
    }
    matchmulDiv_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:\*)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.mulDiv_1, v: $scope$v };
            }
            return $$res;
        });
    }
    matchmulDiv_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$v;
            let $$res = null;
            if (true
                && ($scope$v = this.regexAccept(String.raw `(?:/)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.mulDiv_2, v: $scope$v };
            }
            return $$res;
        });
    }
    matchlist($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$beforeFields;
            let $scope$operands;
            let $scope$afterFields;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:list[(])`, $$dpth + 1, $$cr) !== null
                && ($scope$beforeFields = this.matchsep($$dpth + 1, $$cr)) !== null
                && ($scope$operands = this.matchfieldList($$dpth + 1, $$cr)) !== null
                && ($scope$afterFields = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:[)])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.list, beforeFields: $scope$beforeFields, operands: $scope$operands, afterFields: $scope$afterFields };
            }
            return $$res;
        });
    }
    matchstructure($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$begin;
            let $scope$sepDotData;
            let $scope$eqData;
            let $scope$data;
            let $scope$sepDotDim;
            let $scope$eqDim;
            let $scope$dim;
            let $scope$end;
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:structure[(])`, $$dpth + 1, $$cr) !== null
                && ($scope$begin = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\.)`, $$dpth + 1, $$cr) !== null
                && ($scope$sepDotData = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:Data)`, $$dpth + 1, $$cr) !== null
                && ($scope$eqData = this.matchnameValueSep($$dpth + 1, $$cr)) !== null
                && ($scope$data = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchoperandSep($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\.)`, $$dpth + 1, $$cr) !== null
                && ($scope$sepDotDim = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:Dim)`, $$dpth + 1, $$cr) !== null
                && ($scope$eqDim = this.matchnameValueSep($$dpth + 1, $$cr)) !== null
                && ($scope$dim = this.matchexp($$dpth + 1, $$cr)) !== null
                && ($scope$end = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:[)])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.structure, begin: $scope$begin, sepDotData: $scope$sepDotData, eqData: $scope$eqData, data: $scope$data, sepDotDim: $scope$sepDotDim, eqDim: $scope$eqDim, dim: $scope$dim, end: $scope$end };
            }
            return $$res;
        });
    }
    matchoperandSep($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$before;
            let $scope$after;
            let $$res = null;
            if (true
                && ($scope$before = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:,)`, $$dpth + 1, $$cr) !== null
                && ($scope$after = this.matchsep($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.operandSep, before: $scope$before, after: $scope$after };
            }
            return $$res;
        });
    }
    matchargument($$dpth, $$cr) {
        return this.matchexp($$dpth + 1, $$cr);
    }
    matchargumentList($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && (($scope$content = this.matchargumentList_$0($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.argumentList, content: $scope$content };
            }
            return $$res;
        });
    }
    matchargumentList_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$first;
            let $scope$rest;
            let $$res = null;
            if (true
                && ($scope$first = this.matchargument($$dpth + 1, $$cr)) !== null
                && ($scope$rest = this.loop(() => this.matchargumentList_$0_$0($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.argumentList_$0, first: $scope$first, rest: $scope$rest };
            }
            return $$res;
        });
    }
    matchargumentList_$0_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchoperandSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchargument($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.argumentList_$0_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchindexList($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && (($scope$content = this.matchindexList_$0($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.indexList, content: $scope$content };
            }
            return $$res;
        });
    }
    matchindexList_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$first;
            let $scope$rest;
            let $$res = null;
            if (true
                && (($scope$first = this.matchexp($$dpth + 1, $$cr)) || true)
                && ($scope$rest = this.loop(() => this.matchindexList_$0_$0($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.indexList_$0, first: $scope$first, rest: $scope$rest };
            }
            return $$res;
        });
    }
    matchindexList_$0_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchoperandSep($$dpth + 1, $$cr)) !== null
                && (($scope$item = this.matchexp($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.indexList_$0_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchfield($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$name;
            let $scope$sep;
            let $scope$value;
            let $$res = null;
            if (true
                && ($scope$name = this.matchname($$dpth + 1, $$cr)) !== null
                && ($scope$sep = this.matchnameValueSep($$dpth + 1, $$cr)) !== null
                && ($scope$value = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.field, name: $scope$name, sep: $scope$sep, value: $scope$value };
            }
            return $$res;
        });
    }
    matchfieldList($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && (($scope$content = this.matchfieldList_$0($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.fieldList, content: $scope$content };
            }
            return $$res;
        });
    }
    matchfieldList_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$first;
            let $scope$rest;
            let $$res = null;
            if (true
                && ($scope$first = this.matchfield($$dpth + 1, $$cr)) !== null
                && ($scope$rest = this.loop(() => this.matchfieldList_$0_$0($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.fieldList_$0, first: $scope$first, rest: $scope$rest };
            }
            return $$res;
        });
    }
    matchfieldList_$0_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sep;
            let $scope$item;
            let $$res = null;
            if (true
                && ($scope$sep = this.matchoperandSep($$dpth + 1, $$cr)) !== null
                && ($scope$item = this.matchfield($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.fieldList_$0_$0, sep: $scope$sep, item: $scope$item };
            }
            return $$res;
        });
    }
    matchnameValueSep($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$before;
            let $scope$after;
            let $$res = null;
            if (true
                && ($scope$before = this.matchsep($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:=)`, $$dpth + 1, $$cr) !== null
                && ($scope$after = this.matchsep($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.nameValueSep, before: $scope$before, after: $scope$after };
            }
            return $$res;
        });
    }
    matchname($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$from;
            let $scope$value;
            let $scope$to;
            let $$res = null;
            if (true
                && ($scope$from = this.mark()) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:[a-zA-Z][a-zA-Z0-9._]*)`, $$dpth + 1, $$cr)) !== null
                && ($scope$to = this.mark()) !== null) {
                $$res = { kind: ASTKinds.name, from: $scope$from, value: $scope$value, to: $scope$to };
            }
            return $$res;
        });
    }
    matchscalar($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $$res = null;
            if (true
                && ($scope$value = this.regexAccept(String.raw `(?:-?([\d]+([.][\d]+)?|([\d]+)?[.][\d]+)([eE]-?[\d]+)?)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.scalar, value: $scope$value };
            }
            return $$res;
        });
    }
    test() {
        const mrk = this.mark();
        const res = this.matchprogram(0);
        const ans = res !== null;
        this.reset(mrk);
        return ans;
    }
    parse() {
        const mrk = this.mark();
        const res = this.matchprogram(0);
        if (res)
            return { ast: res, errs: [] };
        this.reset(mrk);
        const rec = new ErrorTracker();
        this.clearMemos();
        this.matchprogram(0, rec);
        const err = rec.getErr();
        return { ast: res, errs: err !== null ? [err] : [] };
    }
    mark() {
        return this.pos;
    }
    loop(func, star = false) {
        const mrk = this.mark();
        const res = [];
        for (;;) {
            const t = func();
            if (t === null) {
                break;
            }
            res.push(t);
        }
        if (star || res.length > 0) {
            return res;
        }
        this.reset(mrk);
        return null;
    }
    run($$dpth, fn) {
        const mrk = this.mark();
        const res = fn();
        if (res !== null)
            return res;
        this.reset(mrk);
        return null;
    }
    choice(fns) {
        for (const f of fns) {
            const res = f();
            if (res !== null) {
                return res;
            }
        }
        return null;
    }
    regexAccept(match, dpth, cr) {
        return this.run(dpth, () => {
            const reg = new RegExp(match, "y");
            const mrk = this.mark();
            reg.lastIndex = mrk.overallPos;
            const res = this.tryConsume(reg);
            if (cr) {
                cr.record(mrk, res, {
                    kind: "RegexMatch",
                    // We substring from 3 to len - 1 to strip off the
                    // non-capture group syntax added as a WebKit workaround
                    literal: match.substring(3, match.length - 1),
                    negated: this.negating,
                });
            }
            return res;
        });
    }
    tryConsume(reg) {
        const res = reg.exec(this.input);
        if (res) {
            let lineJmp = 0;
            let lind = -1;
            for (let i = 0; i < res[0].length; ++i) {
                if (res[0][i] === "\n") {
                    ++lineJmp;
                    lind = i;
                }
            }
            this.pos = {
                overallPos: reg.lastIndex,
                line: this.pos.line + lineJmp,
                offset: lind === -1 ? this.pos.offset + res[0].length : (res[0].length - lind - 1)
            };
            return res[0];
        }
        return null;
    }
    noConsume(fn) {
        const mrk = this.mark();
        const res = fn();
        this.reset(mrk);
        return res;
    }
    negate(fn) {
        const mrk = this.mark();
        const oneg = this.negating;
        this.negating = !oneg;
        const res = fn();
        this.negating = oneg;
        this.reset(mrk);
        return res === null ? true : null;
    }
    memoise(rule, memo) {
        const $scope$pos = this.mark();
        const $scope$memoRes = memo.get($scope$pos.overallPos);
        if (this.memoSafe && $scope$memoRes !== undefined) {
            this.reset($scope$memoRes[1]);
            return $scope$memoRes[0];
        }
        const $scope$result = rule();
        if (this.memoSafe)
            memo.set($scope$pos.overallPos, [$scope$result, this.mark()]);
        return $scope$result;
    }
}
exports.Parser = Parser;
function parse(s) {
    const p = new Parser(s);
    return p.parse();
}
exports.parse = parse;
class SyntaxErr {
    constructor(pos, expmatches) {
        this.pos = pos;
        this.expmatches = [...expmatches];
    }
    toString() {
        return `Syntax Error at line ${this.pos.line}:${this.pos.offset}. Expected one of ${this.expmatches.map(x => x.kind === "EOF" ? " EOF" : ` ${x.negated ? 'not ' : ''}'${x.literal}'`)}`;
    }
}
exports.SyntaxErr = SyntaxErr;
class ErrorTracker {
    constructor() {
        this.mxpos = { overallPos: -1, line: -1, offset: -1 };
        this.regexset = new Set();
        this.pmatches = [];
    }
    record(pos, result, att) {
        if ((result === null) === att.negated)
            return;
        if (pos.overallPos > this.mxpos.overallPos) {
            this.mxpos = pos;
            this.pmatches = [];
            this.regexset.clear();
        }
        if (this.mxpos.overallPos === pos.overallPos) {
            if (att.kind === "RegexMatch") {
                if (!this.regexset.has(att.literal))
                    this.pmatches.push(att);
                this.regexset.add(att.literal);
            }
            else {
                this.pmatches.push(att);
            }
        }
    }
    getErr() {
        if (this.mxpos.overallPos !== -1)
            return new SyntaxErr(this.mxpos, this.pmatches);
        return null;
    }
}
//# sourceMappingURL=parseBUGS.js.map