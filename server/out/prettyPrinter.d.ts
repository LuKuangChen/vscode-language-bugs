export declare type Doc = Array<string>;
export declare function makePrinter(indent?: string): {
    text: (content: string) => Doc;
    nest: (content: Doc) => Doc;
    vconcat: (content: Array<Doc>) => Doc;
    fconcat: (content: Array<Doc>) => Doc;
    inlineBlock: (content: Array<Doc>) => Doc;
    toString: (doc: Doc) => string;
    equations: (eqs: Array<[Doc, string, Doc]>) => Doc;
};
