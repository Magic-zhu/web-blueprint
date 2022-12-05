import { Node } from 'src/node/Node';
import { Point } from './Point';
export declare enum NodeConnectType {
    PRE = 0,
    NEXT = 1
}
export declare class BaseLine {
    _begin: Point;
    _end: Point;
    _color: string;
    _width: number;
    _height: number;
    beginNode: Node;
    endNode: Node;
    beginNodeConnectType: NodeConnectType;
    endNodeConnectType: NodeConnectType;
    _getControlPoint(begin: Point, end: Point): number[];
    _setSize(): void;
}
