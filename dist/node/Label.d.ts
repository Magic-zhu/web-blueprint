import { WpElement } from '../base/WpElement';
export interface LabelOptions {
    text?: string;
}
export declare class Label {
    private _text;
    instance: HTMLSpanElement;
    parent: WpElement;
    constructor(options: LabelOptions);
    get text(): string;
    set text(value: string);
}
