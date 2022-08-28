interface BasePoint {
    key: string;
    value: any;
    type: string;
}
export declare class BaseNode {
    inputPoints: BasePoint[];
    outPutPoints: [];
    variables: any;
    func: (inputPoints: BasePoint[]) => {};
    nodeName: string;
    async: boolean;
    preNode: BaseNode[];
    nextNode: BaseNode[];
    constructor();
    execute(): void;
}
export {};
