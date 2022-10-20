import { WpElement } from './WpElement';
export interface InputOptions {
    type: string;
}
export declare class Input {
    instance: HTMLElement;
    private inputIntance;
    type: string;
    parent: WpElement;
    _value: any;
    constructor(options: InputOptions);
    create(): void;
    inputChangeHanlde(v: any): void;
    get value(): any;
    set value(s: any);
    hidden(): void;
    show(): void;
}
