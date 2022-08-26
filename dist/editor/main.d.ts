import { BaseNode } from "src/blueprint/baseNode";
export declare class BluePrintEditor {
    container: HTMLElement;
    scale: number;
    constructor(container: any);
    init(): void;
    add(node: BaseNode): void;
}
