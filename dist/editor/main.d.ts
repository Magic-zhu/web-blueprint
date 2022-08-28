import { Node } from "src";
export declare class BluePrintEditor {
    container: HTMLElement;
    scale: number;
    constructor(container: any);
    init(): void;
    add(node: Node): void;
}
