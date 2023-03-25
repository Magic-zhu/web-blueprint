import {Point} from 'src/base/Point'
import {createSvg} from 'src/dom/create'
import {Node} from 'src/base/Node'
import {uuid} from './UUID'
import {ClassType} from '../WpElement'
import {LineType} from 'src/gtypes'
import {Param} from './Param'

export enum NodeConnectType {
  PRE = 0,
  NEXT = 1,
}

interface LineOptions {
  color?: string
}

export class Line {
  readonly classType = ClassType.LINE
  _begin: Point
  _end: Point
  _color: string = 'white'
  _width: number
  _height: number
  beginNode: Node
  endNode: Node
  beginParam: Param
  endParam: Param
  beginNodeConnectType: NodeConnectType
  endNodeConnectType: NodeConnectType
  readonly id: string = uuid()
  instance: SVGAElement
  type: LineType

  constructor(begin: Point, end: Point, options: LineOptions = {}) {
    if (options.color) this._color = options.color
    const Path = createSvg('path')
    this.instance = Path
    Path.setAttribute('stroke-width', '2px')
    Path.setAttribute('stroke', this.color)
    Path.setAttribute('fill', 'none')
    this.update(begin, end)
  }

  get color() {
    return this._color
  }

  set color(value: string) {
    this._color = value
    this.instance.setAttribute('stroke', value)
  }

  get begin() {
    return this._begin
  }

  get end() {
    return this._end
  }

  update(begin: Point, end: Point) {
    // @ control point array ex:[x1,y1,x2,y2]
    let cp: number[]
    let path: string
    // ? when the start point is the nextNode
    if (this.beginNodeConnectType === NodeConnectType.NEXT) {
      cp = this._getControlPoint(begin, end)
      path = `M${begin.x},${begin.y} C${cp[0]},${cp[1]} ${cp[2]},${cp[3]} ${end.x},${end.y}`
    } else {
      cp = this._getControlPoint(end, begin)
      path = `M${end.x},${end.y} C${cp[0]},${cp[1]} ${cp[2]},${cp[3]} ${begin.x},${begin.y}`
    }
    this._begin = begin
    this._end = end
    this._setSize()
    this.instance.setAttribute('d', path)
  }

  destroy() {
    // ! here, the instance may had been destroyed
    try {
      this.instance.parentNode.removeChild(this.instance)
    } catch (error) {}
  }

  private _getControlPoint(begin: Point, end: Point): number[] {
    const middlePoint = begin.middleWith(end)
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

  private _setSize() {
    this._width = Math.abs(this._end.x - this._begin.x)
    this._height = Math.abs(this._end.y - this._begin.y)
  }
}
