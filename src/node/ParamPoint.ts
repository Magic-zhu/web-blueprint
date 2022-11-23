import {uuid} from 'src/base/UUID'
import {createSvg} from 'src/dom/create'

export const getColor = (type: string) => {
  let color: string
  switch (type) {
    case 'string':
      color = '#f703cf'
      break
    case 'boolean':
      color = '#8e020b'
      break
    case 'object':
      color = '#20a5e8'
      break
    case 'number':
      color = '#a4fa60'
      break
    case 'process':
      color = '#ffffff'
    case 'any':
      color = '#eeeeee'
      break
  }
  return color
}

export class ParamPoint {
  protected uid = uuid()
  instance: SVGElement
  inside: SVGAElement
  type: string
  color: string

  constructor(options) {
    this.type = options.type
    this.init()
  }

  init() {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'wb-inputPoint-' + this.type)
    // tip# process node
    if (this.type === 'process') {
        const polygon = createSvg('polygon')
        polygon.setAttribute('points', '0,0 10,5 0,10')
        polygon.setAttribute('stroke-width', '1px')
        polygon.setAttribute('stroke', 'white')
        polygon.setAttribute('fill','none')
        this.inside = polygon
        svg.appendChild(polygon)
    }else{
        // tip# common node
        const circle = createSvg('circle')
        circle.setAttribute('cx', '5')
        circle.setAttribute('cy', '5')
        circle.setAttribute('r', '4')
        circle.setAttribute('stroke-width', '1px')
        circle.setAttribute('fill', 'none')
        const color = getColor(this.type)
        this.color = color
        circle.setAttribute('stroke', color)
        this.inside = circle
        svg.appendChild(circle)
    }

    this.instance = svg
  }

  update() {}

  connect() {
    this.inside.setAttribute('fill', this.color)
  }

  disConnect() {
    this.inside.setAttribute('fill', 'none')
  }
}
