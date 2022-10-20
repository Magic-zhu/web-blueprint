import { Label } from './Label';
import { ParamPoint } from './ParamPoint';
import { Input } from './Input';
import { WpElement } from './WpElement';
import { Node } from './Node';
import { Line } from './Line';
export interface ParamOptions {
    type: string;
    isInput?: boolean;
}
export declare class Param {
    protected uid: string;
    instance: HTMLElement;
    type: string;
    point: ParamPoint;
    label: Label;
    input: Input;
    parent: Node;
    linkedLine: Line;
    linkedParam: Param;
    isBeign: boolean;
    isInput: boolean;
    constructor(options: ParamOptions);
    create(): void;
    add(ele: WpElement): void;
    connect(line: Line, param: Param, position: string): void;
    disConnect(): void;
}
