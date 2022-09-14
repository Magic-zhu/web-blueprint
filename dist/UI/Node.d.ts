import { BaseNode } from 'src/blueprint/BaseNode';
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
    color?: string;
    input?: [];
    x?: number;
    y?: number;
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
    initInput(type: string): SVGElement;
    addInput(): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    getColor(type: string): string;
}
