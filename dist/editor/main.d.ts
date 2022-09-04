import { Node } from 'src';
export declare class BluePrintEditor {
    container: HTMLElement;
    scale: number;
    private _orginSize;
    constructor(container: any);
    init(): void;
    add(node: Node): void;
    resize(scale: number): void;
}
