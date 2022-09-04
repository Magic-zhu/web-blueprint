export interface BasePoint {
    key: string;
    value: any;
    type: string;
}
export declare enum StaticInputType {
    string = "string",
    number = "number",
    boolean = "boolean"
}
export declare type InputType = StaticInputType | string;
export declare class BaseNode {
    inputPoints: BasePoint[];
    outPutPoints: BasePoint[];
    variables: any;
    func: (inputPoints: BasePoint[]) => {};
    nodeName: string;
    async: boolean;
    _x: number;
    _y: number;
    preNode: BaseNode[];
    nextNode: BaseNode[];
    constructor();
    execute(): void;
}
