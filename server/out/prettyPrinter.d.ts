export declare type Doc = (indent: string) => Array<string>;
export declare function text(content: string): Doc;
export declare function indent(content: Doc): Doc;
export declare function fcat(content: Array<Doc>): Doc;
export declare function fcatIndent(content: Array<Doc>): Doc;
export declare function lines(content: Array<Doc>): Doc;
export declare function stringOfDoc(doc: Doc, indent?: string): string;
