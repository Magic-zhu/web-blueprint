import { Line } from 'src';
import { Param } from 'src/node/Param';
export interface BasePoint {
    key: string;
    value: any;
    type: string;
}
export declare class BaseNode {
    inputPoints: Param[];
    outPutPoints: Param[];
    variables: any;
    func: (inputPoints: Param[]) => {};
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
    getParamPosition(index: number, isInput?: boolean): number[];
}
