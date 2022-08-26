import { Object3D } from "three";
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
    color?: string;
}
export declare class BaseNode {
    container: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    leftBody: HTMLElement;
    rightBody: HTMLElement;
    prePoint: SVGElement;
    nextPoint: SVGElement;
    inputPoints: [];
    outPutPoints: [];
    v: Object3D;
    preNode: BaseNode[];
    nextNode: BaseNode[];
    headerClass: string;
    nodeName: string;
    color: string;
    selected: boolean;
    active: boolean;
    constructor(params: NodeParams);
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
    initPrePoint(): void;
    initNextPoint(): void;
    onClick(): void;
    onMouseMove(): void;
}
