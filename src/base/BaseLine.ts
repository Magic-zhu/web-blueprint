import {Node} from 'src/node/Node'
import {Point} from './Point'
import { uuid } from './UUID'

export enum NodeConnectType {
  PRE = 0,
  NEXT = 1,
}

export class BaseLine {
  _begin: Point
  _end: Point
  _color: string = 'white'
  _width: number
  _height: number
  beginNode: Node
  endNode: Node
  beginNodeConnectType:NodeConnectType
  endNodeConnectType:NodeConnectType
  readonly id:string = uuid()

  _getControlPoint(begin: Point, end: Point): number[] {
    const middlePoint = begin.middileWith(end)
    if (begin.x < end.x) {
      return [middlePoint.x, begin.y, middlePoint.x, end.y]
    } else {
      return [
        begin.x + begin.x - middlePoint.x,
        begin.y,
        end.x - (middlePoint.x - end.x),
        end.y,
      ]
    }
  }

  _setSize() {
    this._width = Math.abs(this._end.x - this._begin.x)
    this._height = Math.abs(this._end.y - this._begin.y)
  }
}
