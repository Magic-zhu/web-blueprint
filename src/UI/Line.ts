import {BaseLine} from 'src/blueprint/BaseLine'
import {Point} from 'src/blueprint/Point'
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
    const cp = this._getControlPoint(begin, end)
    this._begin = begin
    this._end = end
    this._setSize()
    const path = `M${begin.x},${begin.y} C${cp[0]},${cp[1]} ${cp[2]},${cp[3]} ${end.x},${end.y}`
    this.instance.setAttribute('d', path)
  }

  destory() {
    this.instance.parentNode.removeChild(this.instance)
  }
}
