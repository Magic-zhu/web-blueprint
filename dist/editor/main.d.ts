import { Line, Node } from 'src';
export declare enum MouseDownType {
    'LEFT' = 0,
    'RIGHT' = 2,
    'NONE' = -1
}
export declare enum EditorEventType {
    'Normal' = "normal",
    'NodeActive' = "NodeActive",
    'LineBegin' = "LineBegin",
    'LineEnd' = "LineEnd"
}
export interface ITransform {
    transformOrigin?: string;
    translate?: number[];
}
export interface EventInfo {
    node?: Node;
    pos?: number[];
    isPre?: boolean;
}
export declare class BluePrintEditor {
    container: HTMLElement;
    lineContainer: SVGAElement;
    graph: Node[];
    lineGraph: Line[];
    private scale;
    private _orginSize;
    private _mouseDownType;
    private _mouseDownPosition;
    private _translateLast;
    private _transform;
    private currentEventType;
    private currentTarget;
    private beginNode;
    private currentLine;
    constructor(container: any);
    private init;
    add(node: Node): void;
    addLine(line: Line): void;
    translate(ev: MouseEvent): void;
    resize(scale: number): void;
    private setMouseDownType;
    private recordPosition;
    private initLineContainer;
    private PreNodeHandler;
    private ScaleHandler;
    private NodeMoveHandler;
    private NodeActiveHandler;
    private getOffset;
}
