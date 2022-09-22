import { Line } from 'src';
export interface BasePoint {
    key: string;
    value: any;
    type: string;
}
export declare class BaseNode {
    inputPoints: BasePoint[];
    outPutPoints: BasePoint[];
    variables: any;
    func: (inputPoints: BasePoint[]) => {};
    nodeName: string;
    nodeType: string;
    readonly nodeId: string;
    async: boolean;
    _x: number;
    _y: number;
    preNodes: BaseNode[];
    nextNodes: BaseNode[];
    preLines: Line[];
    nextLines: Line[];
    constructor();
    execute(): void;
    getPrePointPosition(): number[];
    getNextPointPosition(): number[];
}
