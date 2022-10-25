import { BaseNode } from 'src/base/BaseNode';
import { Param } from './Param';
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
    color?: string;
    input?: [];
    output?: [];
    x?: number;
    y?: number;
}
export interface Position {
    x: number;
    y: number;
}
export declare class Node extends BaseNode {
    instance: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    leftBody: HTMLElement;
    rightBody: HTMLElement;
    prePoint: SVGElement;
    nextPoint: SVGElement;
    headerClass: string;
    color: string;
    active: boolean;
    private _selected;
    constructor(params: NodeParams);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get position(): Position;
    get width(): number;
    get height(): number;
    get selected(): boolean;
    set selected(value: boolean);
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
    initPrePoint(): void;
    initNextPoint(): void;
    initInput(type: string, index: number): Param;
    addInput(param: Param): void;
    initOutput(type: string, index: number): Param;
    addOutput(param: Param): void;
    set position(pos: Position);
    connect(info: any): void;
    updateRelativeLines(x: number, y: number): void;
}
