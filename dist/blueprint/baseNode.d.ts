import { Object3D } from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
export declare class BaseNode extends Object3D {
    container: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    inputPoints: [];
    outPutPoints: [];
    _self: CSS2DObject;
    v: Object3D;
    preNode: BaseNode[];
    nextNode: BaseNode[];
    constructor();
    initContainer(): void;
    initHeader(): void;
    initBody(): void;
}
