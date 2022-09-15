
import {BaseLine} from 'src/blueprint/BaseLine'
import {Point} from 'src/blueprint/Point'
import {createSvg} from 'src/dom/create'

export class Line extends BaseLine {
  instance: SVGAElement

  constructor(begin: Point, end: Point) {
    super()
    const svg = createSvg('svg')
    svg.style.position = 'absolute'
    const cp = this._getControlPoint(begin, end)
    this._begin = begin
    this._end = end
    this._setSize()
    const path = `M${2},${2} C${cp[0] - begin.x},${cp[1] - begin.y} ${
      cp[2] - begin.x
    },${cp[3] - begin.y} ${this._width + 2},${this._height + 2}`
    const Path = createSvg('path')
    Path.setAttribute('stroke-width', '2px')
    Path.setAttribute('stroke', 'white')
    Path.setAttribute('fill', 'none')
    Path.setAttribute('d', path)
    svg.style.width = this._width + 4  + 'px'
    svg.style.height = this._height + 4  + 'px'
    svg.style.left = begin.x - 2 + 'px'
    svg.style.top = begin.y - 2 + 'px'
    svg.appendChild(Path)
    this.instance = svg
  }

  update() {}
}
