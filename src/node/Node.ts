import {BaseNode} from 'src/base/BaseNode'
import {createDiv, createSpan, createSvg} from 'src/dom/create'
import IO from 'src/base/IO'
import {Line} from './Line'
import {Point} from 'src/base/Point'
import {Param} from './Param'

export interface NodeParams {
  nodeName: string
  headerClass?: string
  color?: string
  input?: []
  output?: []
  x?: number
  y?: number
}

export interface Position {
  x: number
  y: number
}

export class Node extends BaseNode {
  // * The ui part
  instance: HTMLElement
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
    this.instance.appendChild(this.header)
    this.instance.appendChild(this.body)
    this.leftBody.appendChild(this.prePoint)
    this.rightBody.appendChild(this.nextPoint)
    if (params.input && params.input.length > 0) {
      params.input.forEach((item: any, index: number) => {
        this.addInput(this.initInput(item.type, index))
      })
    }
    if (params.output && params.output.length > 0) {
      params.output.forEach((item: any, index: number) => {
        this.addOutput(this.initOutput(item.type, index))
      })
    }
    this.x = params.x || 0
    this.y = params.y || 0
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
    this.instance.style.left = `${this._x}px`
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
    this.instance.style.top = `${this._y}px`
  }

  get position() {
    return {
      x: this._x,
      y: this._y,
    }
  }

  initContainer() {
    const div = createDiv()
    div.className = 'wb-container-base'
    this.instance = div
    this.instance.addEventListener('mousedown', () => {
      IO.emit('NodeActive', this)
    })
    this.instance.addEventListener('mouseup', () => {
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
    svg.setAttribute('class', 'wb-prePoint')
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
    svg.setAttribute('class', 'wb-nextPoint')
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

  initInput(type: string, index: number) {
    const box = new Param({type})
    box.instance.addEventListener('mousedown', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    box.instance.addEventListener('mouseup', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    box.point.instance.addEventListener('click', (ev: MouseEvent) => {
      IO.emit('ParamPointClick', {
        pos: this.getParamPosition(index),
        node: this,
        param: box,
      })
    })
    return box
  }

  addInput(param: Param) {
    this.inputPoints.push(param)
    param.parent = this
    this.leftBody.appendChild(param.instance)
  }

  initOutput(type: string, index: number) {
    const box = new Param({type, isInput: false})
    box.instance.addEventListener('mousedown', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    box.instance.addEventListener('mouseup', (ev: MouseEvent) => {
      ev.cancelBubble = true
    })
    box.point.instance.addEventListener('click', (ev: MouseEvent) => {
      IO.emit('ParamPointClick', {
        pos: this.getParamPosition(index, false),
        node: this,
        param: box,
      })
    })
    return box
  }

  addOutput(param: Param) {
    this.outPutPoints.push(param)
    param.parent = this
    this.rightBody.appendChild(param.instance)
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
    // tip: update preNode nextNode line
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
    // tip: update inputPoints line
    this.inputPoints.forEach((param: Param, index) => {
      if (!param.linkedLine) return
      const [ix, iy] = this.getParamPosition(index)
      if (param.isBeign) {
        param.linkedLine.update(new Point(ix, iy), param.linkedLine._end)
      } else {
        param.linkedLine.update(param.linkedLine._begin, new Point(ix, iy))
      }
    })
    // tip: update outPoints line
    this.outPutPoints.forEach((param: Param, index) => {
      if (!param.linkedLine) return
      const [ix, iy] = this.getParamPosition(index, false)
      if (param.isBeign) {
        param.linkedLine.update(new Point(ix, iy), param.linkedLine._end)
      } else {
        param.linkedLine.update(param.linkedLine._begin, new Point(ix, iy))
      }
    })
  }
}
