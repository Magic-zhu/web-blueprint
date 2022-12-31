import { Label } from './Label';
import { ParamPoint } from './ParamPoint';
import { Input } from './Input';
import { WpElement, ClassType } from '../WpElement';
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
    param?: Param;
    id: string;
    node?: Node;
    classType: ClassType;
}
export declare class Param {
    readonly classType = ClassType.PARAM;
    protected uid: string;
    instance: HTMLElement;
    type: string;
    name: string;
    private _value;
    get value(): any;
    set value(value: any);
    point: ParamPoint;
    label: Label;
    input: Input;
    parent: Node;
    isConnected: boolean;
    linkedLine: Line;
    private linkedParam;
    linkedObjects: LinkedObject[];
    isBeign: boolean;
    isInput: boolean;
    constructor(options: ParamOptions);
    private create;
    add(ele: WpElement): void;
    connect(line: Line, wpElement: Param | Node, position: string): void;
    disConnect(paramId?: string): void;
    update(value: any): void;
}
