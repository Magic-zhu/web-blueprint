import { Line } from 'src';
import { Param } from 'src/node/Param';
import { ClassType } from '../WpElement';
export interface BasePoint {
    key: string;
    value: any;
    type: string;
}
export declare class BaseNode {
    readonly classType = ClassType.NODE;
    inputPoints: Param[];
    outPutPoints: Param[];
    variables: any;
    func: (inputPoints: Param[], outPutPoints: Param[]) => {};
    nodeName: string;
    nodeType: string;
    _nodeLabel: string;
    nodeBaseWidth: number;
    readonly nodeId: string;
    async: boolean;
    _x: number;
    _y: number;
    preNodeRequired: boolean;
    nextNodeRequired: boolean;
    yAxisPak: number;
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
