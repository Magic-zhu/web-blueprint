import { Object3D } from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
export interface NodeParams {
    nodeName: string;
    headerClass?: string;
}
export declare class BaseNode extends Object3D {
    container: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    leftBody: HTMLElement;
    rightBody: HTMLElement;
    prePoint: SVGElement;
    nextPoint: SVGElement;
    inputPoints: [];
    outPutPoints: [];
    _self: CSS2DObject;
    v: Object3D;
    preNode: BaseNode[];
    nextNode: BaseNode[];
    headerClass: string;
    nodeName: string;
    constructor(params: NodeParams);
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
    initPrePoint(): void;
    initNextPoint(): void;
}
