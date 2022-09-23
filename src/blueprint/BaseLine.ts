import {Node} from 'src/UI/Node'
import {Point} from './Point'

export class BaseLine {
  _begin: Point
  _end: Point
  _color: string = 'white'
  _width: number
  _height: number
  beginNode: Node
  endNode: Node

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
