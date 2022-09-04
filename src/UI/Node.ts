import {BaseNode} from 'src/blueprint/BaseNode'
import {createDiv, createSvg} from 'src/dom/create'

export interface NodeParams {
  nodeName: string
  headerClass?: string
  color?: string
  input?: []
  x?:number
  y?:number
}

export class Node extends BaseNode {
  // * The ui part
  container: HTMLElement
  header: HTMLElement
  body: HTMLElement
  leftBody: HTMLElement
  rightBody: HTMLElement
  prePoint: SVGElement
  nextPoint: SVGElement
  headerClass: string = 'theme-container-base-header'
  color: string

  // * status attribte
  selected: boolean
  // if onmousedown?
  active: boolean = false

  constructor(params: NodeParams) {
    super()
    this.nodeName = params.nodeName
    if (params.headerClass) {
      this.headerClass = params.headerClass
    }
    if (params.color) {
      this.color = params.color
    }
    this.initContainer()
    this.initHeader()
    this.initBody()
    this.initPrePoint()
    this.initNextPoint()
    this.container.appendChild(this.header)
    this.container.appendChild(this.body)
    this.leftBody.appendChild(this.prePoint)
    this.rightBody.appendChild(this.nextPoint)
    if (params.input && params.input.length > 0) {
      params.input.forEach((item: any) => {
        this.leftBody.appendChild(this.initInput(item.type))
      })
    }
    this.x = params.x || 0
    this.y = params.y || 0
  }

  initContainer() {
    const div = createDiv()
    div.className = 'theme-container-base'
    this.container = div
  }

  initHeader() {
    const div = createDiv()
    div.className = this.headerClass
    div.innerText = this.nodeName
    if (this.color) {
      div.style.backgroundColor = this.color
    }
    this.header = div
  }

  initBody() {
    const div = createDiv()
    div.className = 'theme-container-base-body'
    const left = createDiv()
    left.className = 'theme-container-base-body-left'
    const right = createDiv()
    right.className = 'theme-container-base-body-right'
    div.appendChild(left)
    div.appendChild(right)
    this.leftBody = left
    this.rightBody = right
    this.body = div
  }

  initPrePoint() {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'prePoint')
    const polygon: SVGPolygonElement = createSvg('polygon')
    polygon.setAttribute('points', '0,0 0,10 5,10 9,5 5,0')
    polygon.setAttribute('stroke-width', '2px')
    polygon.setAttribute('stroke', 'white')
    polygon.setAttribute('fill', 'none')
    svg.appendChild(polygon)
    this.prePoint = svg
  }

  initNextPoint() {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'nextPoint')
    const polygon: SVGPolygonElement = createSvg('polygon')
    polygon.setAttribute('points', '0,0 0,10 5,10 9,5 5,0')
    polygon.setAttribute('stroke-width', '2px')
    polygon.setAttribute('stroke', 'white')
    polygon.setAttribute('fill', 'none')
    svg.appendChild(polygon)
    this.nextPoint = svg
  }

  initInput(type: string) {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'theme-inputPoint-' + type)
    const circle = createSvg('circle')
    circle.setAttribute('cx', '5')
    circle.setAttribute('cy', '5')
    circle.setAttribute('r', '4')
    circle.setAttribute('stroke-width', '1px')
    circle.setAttribute('fill', 'none')
    let color
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
    }
    circle.setAttribute('stroke', color)
    svg.appendChild(circle)
    return svg
  }

  addInput() {}

  get x() {
    return this._x
  }

  set x(value) {
    this._x = value
    this.container.style.left = `${this._x}px`
  }

  get y() {
    return this._x
  }

  set y(value) {
    this._y = value
    this.container.style.top = `${this._y}px`
  }
}
