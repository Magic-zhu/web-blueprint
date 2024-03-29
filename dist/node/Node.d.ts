import { BaseNode } from 'src/base/BaseNode';
import { Param } from './Param';
import { ConnectInfo } from 'src/gtypes';
export interface InputParam {
    type: string;
    value?: any;
    name: string;
}
export interface OutputParam {
    type: string;
    value?: any;
    name: string;
}
export interface NodeParams {
    nodeName: string;
    nodeLabel?: string;
    headerClass?: string;
    color?: string;
    preNodeRequired?: boolean;
    nextNodeRequired?: boolean;
    input?: InputParam[];
    output?: OutputParam[];
    x?: number;
    y?: number;
    func: any;
}
export interface Position {
    x: number;
    y: number;
}
export declare enum ConnectPosition {
    BEGIN = "begin",
    END = "END"
}
export type outputParamsIdss = string[];
export interface NodeSerialization {
    nodeId: string;
    nodeName: string;
    nodeType: string;
    nodeLabel?: string;
    x: number;
    y: number;
    preNodeIds: string[];
    nextNodeIds: string[];
    inputParamsIds: string[];
    outputParamsIds: outputParamsIdss[];
}
export declare class Node extends BaseNode {
    instance: HTMLElement;
    header: HTMLElement;
    label: HTMLElement;
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
    set position(pos: Position);
    get nodeLabel(): string;
    set nodeLabel(label: string);
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
    initPrePoint(ifNeed: boolean): void;
    initNextPoint(ifNeed: boolean): void;
    initInput({ type, value, name }: {
        type: any;
        value: any;
        name: any;
    }, index: number): Param;
    addInput(param: Param): void;
    initOutput({ type, value, name }: {
        type: any;
        value: any;
        name: any;
    }, index: number): Param;
    addOutput(param: Param): void;
    initLabel(labelText: string): void;
    connect(info: ConnectInfo, position: ConnectPosition): void;
    updateRelativeLines(x: number, y: number): void;
    disConnect(id: string, isPre: boolean): void;
    private callRelativeNodeDisconnect;
    private updatePreOrNextConnectedStatus;
    serialize(): string;
    private getSerilazationStringFromLine;
}
