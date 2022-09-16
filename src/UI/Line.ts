import {BaseLine} from 'src/blueprint/BaseLine'
import {Point} from 'src/blueprint/Point'
import {createSvg} from 'src/dom/create'

export class Line extends BaseLine {
  instance: SVGAElement

  constructor(begin: Point, end: Point) {
    super()
    const cp = this._getControlPoint(begin, end)
    this._begin = begin
    this._end = end
    this._setSize()
    const path = `M${begin.x},${begin.y} C${cp[0]},${cp[1]} ${cp[2]},${cp[3]} ${end.x},${end.y}`
    const Path = createSvg('path')
    Path.setAttribute('stroke-width', '2px')
    Path.setAttribute('stroke', 'white')
    Path.setAttribute('fill', 'none')
    Path.setAttribute('d', path)
    this.instance = Path
  }

  update() {}
}
