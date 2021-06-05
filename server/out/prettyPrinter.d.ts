export declare type Doc = Txt | Ind | Seq;
interface Txt {
    kind: 'txt';
    content: string;
}
interface Ind {
    kind: 'ind';
    content: Doc;
}
interface Seq {
    kind: 'seq';
    dir: Dir;
    content: Array<Doc>;
}
declare type Dir = 'hbox' | 'vbox';
export declare function text(content: string): Doc;
export declare function indent(content: Doc): Doc;
export declare function hbox(content: Array<Doc>): Doc;
export declare function vbox(content: Array<Doc>): Doc;
export declare function stringOfDoc(doc: Doc, indent?: string): string;
export {};
