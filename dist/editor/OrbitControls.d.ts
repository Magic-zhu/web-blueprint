import { EventDispatcher, MOUSE, TOUCH, Vector3, Camera } from 'three';
declare class OrbitControls extends EventDispatcher {
    object: Camera;
    domElement: HTMLElement | Document;
    enabled: boolean;
    target: Vector3;
    center: Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    keys: {
        LEFT: string;
        UP: string;
        RIGHT: string;
        BOTTOM: string;
    };
    mouseButtons: Partial<{
        LEFT: MOUSE;
        MIDDLE: MOUSE;
        RIGHT: MOUSE;
    }>;
    touches: Partial<{
        ONE: TOUCH;
        TWO: TOUCH;
    }>;
    target0: Vector3;
    position0: Vector3;
    zoomO: number;
    constructor(object: any, domElement: any);
}
declare class MapControls extends OrbitControls {
    constructor(object: any, domElement: any);
}
export { OrbitControls, MapControls };
