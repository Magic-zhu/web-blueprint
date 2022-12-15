import { Label } from './Label';
import { ParamPoint } from './ParamPoint';
import { Input } from './Input';
import { WpElement } from './WpElement';
import { Node } from './Node';
import { Line } from './Line';
export interface ParamOptions {
    type: string;
    name?: string;
    value?: any;
    isInput?: boolean;
}
export interface LinkedObject {
    line: Line;
    param: Param;
    id: string;
}
export declare class Param {
    protected uid: string;
    instance: HTMLElement;
    type: string;
    name: string;
    value: any;
    point: ParamPoint;
    label: Label;
    input: Input;
    parent: Node;
    linkedLine: Line;
    private linkedParam;
    linkedObjects: LinkedObject[];
    isBeign: boolean;
    isInput: boolean;
    constructor(options: ParamOptions);
    private create;
    add(ele: WpElement): void;
    connect(line: Line, param: Param, position: string): void;
    disConnect(paramId?: string): void;
    update(value: any): void;
}
