import { BaseLine } from 'src/blueprint/BaseLine';
import { Point } from 'src/blueprint/Point';
export declare class Line extends BaseLine {
    instance: SVGAElement;
    constructor(begin: Point, end: Point);
    update(begin: Point, end: Point): void;
    destory(): void;
}
