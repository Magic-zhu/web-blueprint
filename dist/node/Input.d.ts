import { Param } from './Param';
export interface InputOptions {
    type: string;
}
export declare class Input {
    instance: HTMLElement;
    private inputIntance;
    type: string;
    parent: Param;
    _value: any;
    constructor(options: InputOptions);
    create(): void;
    inputChangeHanlde(v: any): void;
    get value(): any;
    set value(s: any);
    hidden(): void;
    show(): void;
}
