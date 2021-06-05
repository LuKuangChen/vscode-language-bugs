"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxErr = exports.parse = exports.Parser = exports.ASTKinds = void 0;
var ASTKinds;
(function (ASTKinds) {
    ASTKinds["program_1"] = "program_1";
    ASTKinds["program_2"] = "program_2";
    ASTKinds["section_1"] = "section_1";
    ASTKinds["section_2"] = "section_2";
    ASTKinds["model"] = "model";
    ASTKinds["data"] = "data";
    ASTKinds["relation_1"] = "relation_1";
    ASTKinds["relation_2"] = "relation_2";
    ASTKinds["relation_3"] = "relation_3";
    ASTKinds["stochasticRelation"] = "stochasticRelation";
    ASTKinds["deterministicRelation"] = "deterministicRelation";
    ASTKinds["indexedRelation"] = "indexedRelation";
    ASTKinds["exp"] = "exp";
    ASTKinds["application"] = "application";
    ASTKinds["subscript"] = "subscript";
    ASTKinds["structure"] = "structure";
    ASTKinds["list"] = "list";
    ASTKinds["anonArgs"] = "anonArgs";
    ASTKinds["anonArgs_$0"] = "anonArgs_$0";
    ASTKinds["anonArgsRest"] = "anonArgsRest";
    ASTKinds["namedArgs"] = "namedArgs";
    ASTKinds["namedArgs_$0"] = "namedArgs_$0";
    ASTKinds["namedArgsRest"] = "namedArgsRest";
    ASTKinds["exp0_1"] = "exp0_1";
    ASTKinds["exp0_2"] = "exp0_2";
    ASTKinds["exp0_3"] = "exp0_3";
    ASTKinds["exp0_4"] = "exp0_4";
    ASTKinds["exp0_5"] = "exp0_5";
    ASTKinds["exp0_6"] = "exp0_6";
    ASTKinds["exp0_7"] = "exp0_7";
    ASTKinds["exp1_1"] = "exp1_1";
    ASTKinds["exp1_2"] = "exp1_2";
    ASTKinds["exp2_1"] = "exp2_1";
    ASTKinds["exp2_2"] = "exp2_2";
    ASTKinds["exp3_1"] = "exp3_1";
    ASTKinds["exp3_2"] = "exp3_2";
    ASTKinds["name"] = "name";
    ASTKinds["num"] = "num";
    ASTKinds["ws_1"] = "ws_1";
    ASTKinds["ws_2"] = "ws_2";
})(ASTKinds = exports.ASTKinds || (exports.ASTKinds = {}));
class Parser {
    constructor(input) {
        this.negating = false;
        this.memoSafe = true;
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
    }
    matchprogram($$dpth, $$cr) {
        return this.choice([
            () => this.matchprogram_1($$dpth + 1, $$cr),
            () => this.matchprogram_2($$dpth + 1, $$cr),
        ]);
    }
    matchprogram_1($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$data;
            let $$res = null;
            if (true
                && ($scope$data = this.matchlist($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.program_1, data: $scope$data };
            }
            return $$res;
        });
    }
    matchprogram_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$sections;
            let $$res = null;
            if (true
                && ($scope$sections = this.loop(() => this.matchsection($$dpth + 1, $$cr), false)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.program_2, sections: $scope$sections };
            }
            return $$res;
        });
    }
    matchsection($$dpth, $$cr) {
        return this.choice([
            () => this.matchsection_1($$dpth + 1, $$cr),
            () => this.matchsection_2($$dpth + 1, $$cr),
        ]);
    }
    matchsection_1($$dpth, $$cr) {
        return this.matchmodel($$dpth + 1, $$cr);
    }
    matchsection_2($$dpth, $$cr) {
        return this.matchdata($$dpth + 1, $$cr);
    }
    matchmodel($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$body;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:model)`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:{)`, $$dpth + 1, $$cr) !== null
                && ($scope$body = this.loop(() => this.matchrelation($$dpth + 1, $$cr), true)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:})`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.model, body: $scope$body };
            }
            return $$res;
        });
    }
    matchdata($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$body;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:data)`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:{)`, $$dpth + 1, $$cr) !== null
                && ($scope$body = this.loop(() => this.matchrelation($$dpth + 1, $$cr), true)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:})`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.data, body: $scope$body };
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
    matchstochasticRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$lhs;
            let $scope$rhs;
            let $$res = null;
            if (true
                && ($scope$lhs = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:~)`, $$dpth + 1, $$cr) !== null
                && ($scope$rhs = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.stochasticRelation, lhs: $scope$lhs, rhs: $scope$rhs };
            }
            return $$res;
        });
    }
    matchdeterministicRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$lhs;
            let $scope$rhs;
            let $$res = null;
            if (true
                && ($scope$lhs = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:<-)`, $$dpth + 1, $$cr) !== null
                && ($scope$rhs = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.deterministicRelation, lhs: $scope$lhs, rhs: $scope$rhs };
            }
            return $$res;
        });
    }
    matchindexedRelation($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$name;
            let $scope$domain;
            let $scope$body;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:for)`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && ($scope$name = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:in)`, $$dpth + 1, $$cr) !== null
                && ($scope$domain = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:{)`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && ($scope$body = this.loop(() => this.matchrelation($$dpth + 1, $$cr), true)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:})`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.indexedRelation, name: $scope$name, domain: $scope$domain, body: $scope$body };
            }
            return $$res;
        });
    }
    matchexp($$dpth, $$cr) {
        return this.matchexp3($$dpth + 1, $$cr);
    }
    matchapplication($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$operator;
            let $scope$operand;
            let $$res = null;
            if (true
                && ($scope$operator = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && ($scope$operand = this.matchanonArgs($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.application, operator: $scope$operator, operand: $scope$operand };
            }
            return $$res;
        });
    }
    matchsubscript($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$vector;
            let $scope$index;
            let $$res = null;
            if (true
                && ($scope$vector = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\[)`, $$dpth + 1, $$cr) !== null
                && ($scope$index = this.matchanonArgs($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\])`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.subscript, vector: $scope$vector, index: $scope$index };
            }
            return $$res;
        });
    }
    matchstructure($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$data;
            let $scope$dim;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:structure\()`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:.Data=)`, $$dpth + 1, $$cr) !== null
                && ($scope$data = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:.Dim=)`, $$dpth + 1, $$cr) !== null
                && ($scope$dim = this.matchexp($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.structure, data: $scope$data, dim: $scope$dim };
            }
            return $$res;
        });
    }
    matchlist($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:list\()`, $$dpth + 1, $$cr) !== null
                && ($scope$content = this.matchnamedArgs($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.list, content: $scope$content };
            }
            return $$res;
        });
    }
    matchanonArgs($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && (($scope$content = this.matchanonArgs_$0($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.anonArgs, content: $scope$content };
            }
            return $$res;
        });
    }
    matchanonArgs_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$first;
            let $scope$rest;
            let $$res = null;
            if (true
                && ($scope$first = this.matchexp($$dpth + 1, $$cr)) !== null
                && ($scope$rest = this.loop(() => this.matchanonArgsRest($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.anonArgs_$0, first: $scope$first, rest: $scope$rest };
            }
            return $$res;
        });
    }
    matchanonArgsRest($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$item;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:,)`, $$dpth + 1, $$cr) !== null
                && ($scope$item = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.anonArgsRest, item: $scope$item };
            }
            return $$res;
        });
    }
    matchnamedArgs($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$content;
            let $$res = null;
            if (true
                && (($scope$content = this.matchnamedArgs_$0($$dpth + 1, $$cr)) || true)) {
                $$res = { kind: ASTKinds.namedArgs, content: $scope$content };
            }
            return $$res;
        });
    }
    matchnamedArgs_$0($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$firstName;
            let $scope$firstExp;
            let $scope$rest;
            let $$res = null;
            if (true
                && ($scope$firstName = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:=)`, $$dpth + 1, $$cr) !== null
                && ($scope$firstExp = this.matchexp($$dpth + 1, $$cr)) !== null
                && ($scope$rest = this.loop(() => this.matchnamedArgsRest($$dpth + 1, $$cr), true)) !== null) {
                $$res = { kind: ASTKinds.namedArgs_$0, firstName: $scope$firstName, firstExp: $scope$firstExp, rest: $scope$rest };
            }
            return $$res;
        });
    }
    matchnamedArgsRest($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$name;
            let $scope$value;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:,)`, $$dpth + 1, $$cr) !== null
                && ($scope$name = this.matchname($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:=)`, $$dpth + 1, $$cr) !== null
                && ($scope$value = this.matchexp($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.namedArgsRest, name: $scope$name, value: $scope$value };
            }
            return $$res;
        });
    }
    matchexp0($$dpth, $$cr) {
        return this.choice([
            () => this.matchexp0_1($$dpth + 1, $$cr),
            () => this.matchexp0_2($$dpth + 1, $$cr),
            () => this.matchexp0_3($$dpth + 1, $$cr),
            () => this.matchexp0_4($$dpth + 1, $$cr),
            () => this.matchexp0_5($$dpth + 1, $$cr),
            () => this.matchexp0_6($$dpth + 1, $$cr),
            () => this.matchexp0_7($$dpth + 1, $$cr),
        ]);
    }
    matchexp0_1($$dpth, $$cr) {
        return this.matchname($$dpth + 1, $$cr);
    }
    matchexp0_2($$dpth, $$cr) {
        return this.matchnum($$dpth + 1, $$cr);
    }
    matchexp0_3($$dpth, $$cr) {
        return this.matchapplication($$dpth + 1, $$cr);
    }
    matchexp0_4($$dpth, $$cr) {
        return this.matchsubscript($$dpth + 1, $$cr);
    }
    matchexp0_5($$dpth, $$cr) {
        return this.matchstructure($$dpth + 1, $$cr);
    }
    matchexp0_6($$dpth, $$cr) {
        return this.matchlist($$dpth + 1, $$cr);
    }
    matchexp0_7($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$exp;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\()`, $$dpth + 1, $$cr) !== null
                && ($scope$exp = this.matchexp3($$dpth + 1, $$cr)) !== null
                && this.regexAccept(String.raw `(?:\))`, $$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.exp0_7, exp: $scope$exp };
            }
            return $$res;
        });
    }
    matchexp1($$dpth, $$cr) {
        return this.choice([
            () => this.matchexp1_1($$dpth + 1, $$cr),
            () => this.matchexp1_2($$dpth + 1, $$cr),
        ]);
    }
    matchexp1_1($$dpth, $$cr) {
        return this.matchexp0($$dpth + 1, $$cr);
    }
    matchexp1_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp0($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\+)`, $$dpth + 1, $$cr) !== null
                && ($scope$right = this.matchexp1($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp1_2, left: $scope$left, right: $scope$right };
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
        return this.matchexp1($$dpth + 1, $$cr);
    }
    matchexp2_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp1($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?:\*)`, $$dpth + 1, $$cr) !== null
                && ($scope$right = this.matchexp2($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp2_2, left: $scope$left, right: $scope$right };
            }
            return $$res;
        });
    }
    matchexp3($$dpth, $$cr) {
        return this.choice([
            () => this.matchexp3_1($$dpth + 1, $$cr),
            () => this.matchexp3_2($$dpth + 1, $$cr),
        ]);
    }
    matchexp3_1($$dpth, $$cr) {
        return this.matchexp2($$dpth + 1, $$cr);
    }
    matchexp3_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$left;
            let $scope$right;
            let $$res = null;
            if (true
                && ($scope$left = this.matchexp2($$dpth + 1, $$cr)) !== null
                && this.matchws($$dpth + 1, $$cr) !== null
                && this.regexAccept(String.raw `(?::)`, $$dpth + 1, $$cr) !== null
                && ($scope$right = this.matchexp3($$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.exp3_2, left: $scope$left, right: $scope$right };
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
                && this.matchws($$dpth + 1, $$cr) !== null
                && ($scope$from = this.mark()) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:[a-zA-Z][a-zA-Z0-9._]*)`, $$dpth + 1, $$cr)) !== null
                && ($scope$to = this.mark()) !== null) {
                $$res = { kind: ASTKinds.name, from: $scope$from, value: $scope$value, to: $scope$to };
            }
            return $$res;
        });
    }
    matchnum($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $scope$value;
            let $$res = null;
            if (true
                && this.matchws($$dpth + 1, $$cr) !== null
                && ($scope$value = this.regexAccept(String.raw `(?:-?[\d]+([.][\d]+)?([eE]-?[\d]+)?)`, $$dpth + 1, $$cr)) !== null) {
                $$res = { kind: ASTKinds.num, value: $scope$value };
            }
            return $$res;
        });
    }
    matchws($$dpth, $$cr) {
        return this.choice([
            () => this.matchws_1($$dpth + 1, $$cr),
            () => this.matchws_2($$dpth + 1, $$cr),
        ]);
    }
    matchws_1($$dpth, $$cr) {
        return this.regexAccept(String.raw `(?:\s*)`, $$dpth + 1, $$cr);
    }
    matchws_2($$dpth, $$cr) {
        return this.run($$dpth, () => {
            let $$res = null;
            if (true
                && this.regexAccept(String.raw `(?:\s*#.*$)`, $$dpth + 1, $$cr) !== null
                && this.matchws($$dpth + 1, $$cr) !== null) {
                $$res = { kind: ASTKinds.ws_2, };
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