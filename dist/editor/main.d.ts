import { Line, Node } from 'src';
export declare enum MouseDownType {
    'LEFT' = 0,
    'RIGHT' = 2,
    'NONE' = -1
}
export interface ITransform {
    transformOrigin?: string;
    translate?: number[];
}
export declare class BluePrintEditor {
    container: HTMLElement;
    lineContainer: SVGAElement;
    private scale;
    private _orginSize;
    private _mouseDownType;
    private _mouseDownPosition;
    private _translateLast;
    private _transform;
    constructor(container: any);
    private init;
    add(node: Node): void;
    addLine(line: Line): void;
    translate(ev: MouseEvent): void;
    resize(scale: number): void;
    private setMouseDownType;
    private recordPosition;
    private initLineContainer;
}
