export interface LabelOptions {
    text?: string;
}
export declare class Label {
    private _text;
    instance: HTMLSpanElement;
    constructor(options: LabelOptions);
    get text(): string;
    set text(value: string);
}
