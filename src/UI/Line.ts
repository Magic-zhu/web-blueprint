import {BaseLine} from 'src/blueprint/BaseLine'
import {Point} from 'src/blueprint/Point'
import {createSvg} from 'src/dom/create'

export class Line extends BaseLine {
  instance: SVGAElement

  constructor(begin: Point, end: Point) {
    super()
    const Path = createSvg('path')
    this.instance = Path
    Path.setAttribute('stroke-width', '2px')
    Path.setAttribute('stroke', 'white')
    Path.setAttribute('fill', 'none')
    this.update(begin, end)
  }

  update(begin: Point, end: Point) {
    const cp = this._getControlPoint(begin, end)
    this._begin = begin
    this._end = end
    this._setSize()
    const path = `M${begin.x},${begin.y} C${cp[0]},${cp[1]} ${cp[2]},${cp[3]} ${end.x},${end.y}`
    this.instance.setAttribute('d', path)
  }
}
