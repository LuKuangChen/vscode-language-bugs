"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringOfDoc = exports.lines = exports.fcatIndent = exports.fcat = exports.indent = exports.text = void 0;
function text(content) {
    return (_) => [content];
}
exports.text = text;
function indent(content) {
    return (indentTxt) => content(indentTxt).map((line) => indentTxt + line);
}
exports.indent = indent;
function repeat(s, i) {
    if (i === 0) {
        return "";
    }
    else {
        return s + repeat(s, i - 1);
    }
}
function fcat(content) {
    return (indent) => content.
        map((doc) => doc(indent)).
        reduce((IH, cur) => {
        const lastLine = IH[IH.length - 1];
        return [
            ...IH.slice(0, -1),
            lastLine + cur[0],
            ...cur.slice(1)
        ];
    }, [""]);
}
exports.fcat = fcat;
function fcatIndent(content) {
    return (indent) => content.
        map((doc) => doc(indent)).
        reduce((IH, cur) => {
        const lastLine = IH[IH.length - 1];
        return [
            ...IH.slice(0, -1),
            lastLine + cur[0],
            ...cur.slice(1).map((line) => {
                return repeat(' ', lastLine.length) + line;
            })
        ];
    }, [""]);
}
exports.fcatIndent = fcatIndent;
function lines(content) {
    return (indent) => content.flatMap((doc) => {
        return doc(indent);
    });
}
exports.lines = lines;
function stringOfDoc(doc, indent = '  ') {
    return doc(indent).join('\n');
}
exports.stringOfDoc = stringOfDoc;
//# sourceMappingURL=prettyPrinter.js.map