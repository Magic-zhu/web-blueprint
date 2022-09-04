import {createSvg} from 'src/dom/create'

class Line extends BaseLine {
  instance: SVGAElement

  constructor(begin: number[], end: number[]) {
    super()
    const svg = createSvg('svg')
    const cp = this.getControlPoint(begin, end)
    const path = `M${begin[0]} ${begin[1]} C${cp[0]} ${cp[1]} ${cp[2]} ${cp[3]} ${end[0]} ${end[1]}`
    const Path = createSvg('path')
    Path.setAttribute('stroke-width', '2px')
    Path.setAttribute('stroke', 'white')
    Path.setAttribute('fill', 'none')
    Path.setAttribute('path', path)
    svg.appendChild(Path)
    this.instance = svg
  }

  update() {}

  getControlPoint(begin: number[], end: number[]): number[] {
    return []
  }
}
