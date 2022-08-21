import { BaseNode } from "src/blueprint/baseNode";
import { Scene } from "three";
export declare class BluePrintEditor {
    container: Element;
    _scene: Scene;
    constructor(container: any);
    init(): void;
    add(node: BaseNode): void;
}
