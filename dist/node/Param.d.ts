import { Label } from './Label';
import { ParamPoint } from './ParamPoint';
import { Input } from './Input';
import { WpElement } from './WpElement';
export interface ParamOptions {
    type: string;
}
export declare class Param {
    protected uid: string;
    instance: HTMLElement;
    type: string;
    point: ParamPoint;
    label: Label;
    input: Input;
    parent: WpElement;
    constructor(options: ParamOptions);
    create(): void;
    add(ele: WpElement): void;
    connect(): void;
    disConnect(): void;
}
