import { BaseNode } from 'src/blueprint/BaseNode';
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
    color?: string;
    input?: [];
    x?: number;
    y?: number;
}
export interface Position {
    x: number;
    y: number;
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
    getColor(type: string): string;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get position(): Position;
    set position(pos: Position);
    connect(info: any): void;
    updateRelativeLines(x: number, y: number): void;
}
