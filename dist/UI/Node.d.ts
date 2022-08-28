import { BaseNode } from "src/blueprint/BaseNode";
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
    color?: string;
}
export declare class Node extends BaseNode {
    container: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    leftBody: HTMLElement;
    rightBody: HTMLElement;
    prePoint: SVGElement;
    nextPoint: SVGElement;
    headerClass: string;
    color: string;
    selected: boolean;
    active: boolean;
    constructor(params: NodeParams);
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
    initPrePoint(): void;
    initNextPoint(): void;
    initInput(): void;
    addInput(): void;
}
