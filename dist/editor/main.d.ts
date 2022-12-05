import { Line, Node } from 'src';
import { Param } from 'src/node/Param';
import { Selector } from './Selector';
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
export interface ClickInfo {
    pos: number[];
    isPre?: boolean;
    node: Node;
    param?: Param;
    line?: Line;
}
export declare class BluePrintEditor {
    container: HTMLElement;
    lineContainer: SVGAElement;
    selector: Selector;
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
    private beginParam;
    private currentLine;
    onRightClick: Function;
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
    private getScaleOffset;
    private getScaleOffset_T;
    private isLineBegin;
    private handleConnectPointClick;
    private paramPointClickHandler;
    private resetAfterAttachLine;
    private SelectHandler;
    private canBeConnected;
}
