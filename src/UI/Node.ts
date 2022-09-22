import {BaseNode} from 'src/blueprint/BaseNode'
import {createDiv, createSvg} from 'src/dom/create'
import IO from 'src/blueprint/IO'
import {Line} from './Line'
import {Point} from 'src/blueprint/Point'

export interface NodeParams {
  nodeName: string
  headerClass?: string
  color?: string
  input?: []
  x?: number
  y?: number
}

export interface Position {
  x: number
  y: number
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
  headerClass: string = 'wb-container-base-header'
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
    div.className = 'wb-container-base'
    this.container = div
    // this.container.addEventListener('click', () => {
    //   if (this.selected) {
    //     // !! attention to the white space
    //     this.container.className = this.container.className.replace(
    //       ' selected',
    //       '',
    //     )
    //   } else {
    //     this.container.className = this.container.className + ' selected'
    //   }
    //   this.selected = !this.selected
    //   IO.emit('NodeSelected', this)
    // })
    this.container.addEventListener('mousedown', () => {
      IO.emit('NodeActive', this)
    })
    this.container.addEventListener('mouseup', () => {
      IO.emit('NodeInactive', this)
    })
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
    div.className = 'wb-container-base-body'
    const left = createDiv()
    left.className = 'wb-container-base-body-left'
    const right = createDiv()
    right.className = 'wb-container-base-body-right'
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
    svg.addEventListener('mousedown', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    svg.addEventListener('mouseup', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    svg.addEventListener('click', (ev: MouseEvent) => {
      ev.cancelBubble = true
      IO.emit('ConnectPointClick', {
        pos: this.getPrePointPosition(),
        node: this,
        isPre: true,
      })
    })
    svg.addEventListener('mouseenter', () => {
      IO.emit('ConnectPointEnter', {
        node: this,
        isPre: true,
      })
    })
    svg.addEventListener('mouseleave', () => {
      IO.emit('ConnectPointLeave', {
        node: this,
        isPre: true,
      })
    })
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
    svg.addEventListener('mousedown', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    svg.addEventListener('mouseup', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    svg.addEventListener('click', (ev: MouseEvent) => {
      ev.cancelBubble = true
      IO.emit('ConnectPointClick', {
        pos: this.getNextPointPosition(),
        node: this,
        isPre: false,
      })
    })
    this.nextPoint = svg
  }

  initInput(type: string) {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'wb-inputPoint-' + type)
    const circle = createSvg('circle')
    circle.setAttribute('cx', '5')
    circle.setAttribute('cy', '5')
    circle.setAttribute('r', '4')
    circle.setAttribute('stroke-width', '1px')
    circle.setAttribute('fill', 'none')
    const color = this.getColor(type)
    circle.setAttribute('stroke', color)
    svg.appendChild(circle)
    return svg
  }

  addInput() {}

  getColor(type: string) {
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
    }
    return color
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
    this.container.style.left = `${this._x}px`
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
    this.container.style.top = `${this._y}px`
  }

  get position() {
    return {
      x: this._x,
      y: this._y,
    }
  }

  set position(pos: Position) {
    this.x = pos.x
    this.y = pos.y
    this.updateRelativeLines(pos.x, pos.y)
  }

  connect(info) {
    if (info.isPre) {
      this.preNodes.push(info.node)
      const inside: any = this.prePoint.childNodes[0]
      inside.setAttribute('fill', 'white')
      this.preLines.push(info.line)
      info.line.endNode = this
    } else {
      this.nextNodes.push(info.node)
      const inside: any = this.nextPoint.childNodes[0]
      inside.setAttribute('fill', 'white')
      this.nextLines.push(info.line)
      info.line.beginNode = this
    }
  }

  updateRelativeLines(x: number, y: number) {
    const [ix, iy] = this.getPrePointPosition()
    this.preLines.forEach((line: Line) => {
      if (line.beginNode.nodeId === this.nodeId) {
        line.update(new Point(ix, iy), line._end)
      } else {
        line.update(line._begin, new Point(ix, iy))
      }
    })
    this.nextLines.forEach((line: Line) => {
      const [ix, iy] = this.getNextPointPosition()
      if (line.beginNode.nodeId === this.nodeId) {
        line.update(new Point(ix, iy), line._end)
      } else {
        line.update(line._begin, new Point(ix, iy))
      }
    })
  }
}
