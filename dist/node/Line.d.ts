import { BaseLine } from 'src/base/BaseLine';
import { Point } from 'src/base/Point';
interface LineOptions {
    color?: string;
}
export declare class Line extends BaseLine {
    instance: SVGAElement;
    constructor(begin: Point, end: Point, options?: LineOptions);
    get color(): string;
    set color(value: string);
    update(begin: Point, end: Point): void;
    destory(): void;
}
export {};
