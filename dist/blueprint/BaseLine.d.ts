import { Node } from 'src/UI/Node';
import { Point } from './Point';
export declare class BaseLine {
    _begin: Point;
    _end: Point;
    color: string;
    _width: number;
    _height: number;
    beginNode: Node;
    endNode: Node;
    _getControlPoint(begin: Point, end: Point): number[];
    _setSize(): void;
}
