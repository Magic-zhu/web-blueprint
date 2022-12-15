import {BaseLine, NodeConnectType} from 'src/base/BaseLine'
import {Point} from 'src/base/Point'
import {createSvg} from 'src/dom/create'

interface LineOptions {
  color?: string
}
export class Line extends BaseLine {
  instance: SVGAElement

  constructor(begin: Point, end: Point, options: LineOptions = {}) {
    super()
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

  destory() {
    try {
      this.instance.parentNode.removeChild(this.instance)
    } catch (error) {}
  }
}
