"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const PETParse = require("./parseBUGS");
function positionOfPosInfo(pos) {
    return {
        "line": pos.line,
        "character": pos.offset
    };
}
function succeed(v) {
    return { kind: "value", content: v };
}
function fail(e) {
    return { kind: "error", content: e };
}
function parse(sourceCode) {
    let parseResult = PETParse.parse(sourceCode);
    if (parseResult.ast !== null) {
        return succeed(transformProgram(parseResult.ast));
    }
    else {
        return fail(positionOfPosInfo(parseResult.errs[0].pos));
    }
}
exports.parse = parse;
function transformProgram(program) {
    function tName(name) {
        return {
            literal: name.value,
            start: positionOfPosInfo(name.from),
            end: positionOfPosInfo(name.to)
        };
    }
    function tExp(exp) {
        if (exp.kind === 'name') {
            return { kind: 'variable', name: tName(exp) };
        }
        else if (exp.kind === 'num') {
            return { kind: 'scalar', literal: exp.value };
        }
        else if (exp.kind === 'application') {
            let operands = [];
            if (exp.operand.content !== null) {
                operands.push(tExp(exp.operand.content.first));
                exp.operand.content.rest.forEach((x) => {
                    operands.push(tExp(x.item));
                });
            }
            return { kind: 'application', operator: tName(exp.operator), operands };
        }
        else if (exp.kind === 'subscript') {
            let operands = [];
            if (exp.index.content) {
                operands.push(tExp(exp.index.content.first));
                exp.index.content.rest.forEach((x) => {
                    operands.push(tExp(x.item));
                });
            }
            return { kind: 'subscription', operator: tName(exp.vector), operands };
        }
        else if (exp.kind === 'structure') {
            return { kind: 'structure', data: tExp(exp.data), dim: tExp(exp.dim) };
        }
        else if (exp.kind === 'list') {
            return tList(exp);
        }
        else if (exp.kind === 'exp0_7') {
            return { kind: '()', content: tExp(exp.exp) };
        }
        else if (exp.kind === 'exp1_2') {
            return { kind: 'binop', operator: '+', lft: tExp(exp.left), rht: tExp(exp.right) };
        }
        else if (exp.kind === 'exp2_2') {
            return { kind: 'binop', operator: '*', lft: tExp(exp.left), rht: tExp(exp.right) };
        }
        else if (exp.kind === 'exp3_2') {
            return { kind: 'binop', operator: ':', lft: tExp(exp.left), rht: tExp(exp.right) };
        }
        else {
            throw "Never";
        }
    }
    function tList(list) {
        const newArgs = [];
        const oldArgs = list.content;
        if (oldArgs.content !== null) {
            newArgs.push([tName(oldArgs.content.firstName), tExp(oldArgs.content.firstExp)]);
        }
        return { kind: "list", "content": newArgs };
    }
    function tRelation(relation) {
        if (relation.kind === 'stochasticRelation') {
            return { kind: '~', lhs: tExp(relation.lhs), rhs: tExp(relation.rhs) };
        }
        else if (relation.kind === 'deterministicRelation') {
            return { kind: '=', lhs: tExp(relation.lhs), rhs: tExp(relation.rhs) };
        }
        else {
            return { kind: 'for', 'name': tName(relation.name), 'domain': tExp(relation.domain), 'body': relation.body.map(tRelation) };
        }
    }
    function tSession(session) {
        if (session.kind === 'model') {
            return { "kind": 'model', 'body': session.body.map(tRelation) };
        }
        else {
            return { "kind": 'data', 'body': session.body.map(tRelation) };
        }
    }
    if (program.kind === 'program_1') {
        return { kind: 'data', content: tList(program.data) };
    }
    else {
        return { kind: 'model', content: program.sections.map(tSession) };
    }
}
//# sourceMappingURL=BUGSKits.js.map