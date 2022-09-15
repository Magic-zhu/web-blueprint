import {Point} from './Point'

export class BaseLine {
  _begin: Point
  _end: Point
  color: string = 'white'
  _width: number
  _height: number

  _getControlPoint(begin: Point, end: Point): number[] {
    return [begin.x + 100, begin.y, end.x - 100, end.y]
  }

  _setSize() {
    this._width = Math.abs(this._end.x - this._begin.x)
    this._height = Math.abs(this._end.y - this._begin.y)
  }
}
