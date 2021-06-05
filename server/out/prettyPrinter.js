"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringOfDoc = exports.vbox = exports.hbox = exports.indent = exports.text = void 0;
function text(content) {
    return { kind: 'txt', content };
}
exports.text = text;
function indent(content) {
    return { kind: 'ind', content };
}
exports.indent = indent;
function hbox(content) {
    return { kind: 'seq', dir: 'hbox', content };
}
exports.hbox = hbox;
function vbox(content) {
    return { kind: 'seq', dir: 'vbox', content };
}
exports.vbox = vbox;
function stringOfDoc(doc, indent = '  ') {
    return linesOfDoc(doc, indent).join('\n');
}
exports.stringOfDoc = stringOfDoc;
function linesOfDoc(doc, indent = '  ') {
    if (doc.kind === 'ind') {
        return linesOfDoc(doc.content).map((line) => {
            return indent + line;
        });
    }
    else if (doc.kind === 'txt') {
        return [doc.content];
    }
    else {
        function repeat(s, i) {
            if (i === 0) {
                return "";
            }
            else {
                return s + repeat(s, i - 1);
            }
        }
        if (doc.dir === 'hbox') {
            return doc.content.
                map((doc) => linesOfDoc(doc, indent)).
                reduce((IH, cur) => {
                const lastLine = IH[IH.length - 1];
                return [
                    ...IH.slice(0, -1),
                    lastLine + cur[0],
                    ...cur.slice(1).map((line) => {
                        return repeat(' ', lastLine.length) + line;
                    })
                ];
            });
        }
        else {
            return doc.content.
                map((doc) => linesOfDoc(doc, indent)).
                reduce((IH, cur) => IH.concat(cur));
        }
    }
}
//# sourceMappingURL=prettyPrinter.js.map