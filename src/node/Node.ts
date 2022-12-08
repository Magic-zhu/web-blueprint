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
  preNodeRequired?: boolean
  nextNodeRequired?: boolean
  input?: []
  output?: []
  x?: number
  y?: number
  func: any
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

  // if onmousedown?
  active: boolean = false

  private _selected: boolean = false

  constructor(params: NodeParams) {
    super()
    this.nodeName = params.nodeName
    if (params.headerClass) {
      this.headerClass = params.headerClass
    }
    if (params.color) {
      this.color = params.color
    }
    this.func = params.func
    this.initContainer()

    this.initHeader()
    this.instance.appendChild(this.header)

    this.initBody()
    this.instance.appendChild(this.body)

    if (params.preNodeRequired || params.preNodeRequired === undefined) {
      this.preNodeRequired = true
    } else {
      this.preNodeRequired = false
    }

    if (params.nextNodeRequired || params.nextNodeRequired === undefined) {
      this.nextNodeRequired = true
    } else {
      this.nextNodeRequired = false
    }

    if (this.nextNodeRequired || this.preNodeRequired) {
      this.initPrePoint(this.preNodeRequired)
      this.leftBody.appendChild(this.prePoint)
      this.initNextPoint(this.nextNodeRequired)
      this.rightBody.appendChild(this.nextPoint)
    }

    // tip *  no next point or pre point  this value should be 10;otherwise should be 0
    // tip *  yAxisPak -> calculate the point position
    if (!this.nextNodeRequired && !this.preNodeRequired) {
      this.yAxisPak = 0
    }

    if (params.input && params.input.length > 0) {
      params.input.forEach((item: any, index: number) => {
        this.addInput(this.initInput(item, index))
      })
    }
    if (params.output && params.output.length > 0) {
      params.output.forEach((item: any, index: number) => {
        this.addOutput(this.initOutput(item, index))
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

  get width() {
    return this.instance.clientWidth
  }

  get height() {
    return this.instance.clientHeight
  }

  get selected() {
    return this._selected
  }

  set selected(value: boolean) {
    if (this._selected === value) {
      return
    }
    this._selected = value
    if (value) {
      this.instance.className = this.instance.className + ' ' + 'selected'
    } else {
      this.instance.className = this.instance.className.replace(' selected', '')
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
      div.style.background = this.color
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

  initPrePoint(ifNeed: boolean) {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'wb-prePoint')
    if (!ifNeed) {
      this.prePoint = svg
      return
    }
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

  initNextPoint(ifNeed: boolean) {
    const svg: SVGElement = createSvg('svg')
    svg.setAttribute('class', 'wb-nextPoint')
    if (!ifNeed) {
      this.nextPoint = svg
      return
    }
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

  initInput({type, value, name}, index: number) {
    const box = new Param({type, value, name})
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

  initOutput({type, value, name}, index: number) {
    const box = new Param({type, value, name, isInput: false})
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

  connect(info, position: string) {
    if (info.isPre) {
      this.preNodes.push(info.node)
      const inside: any = this.prePoint.childNodes[0]
      inside.setAttribute('fill', 'white')
      this.preLines.push(info.line)
    } else {
      this.nextNodes.push(info.node)
      const inside: any = this.nextPoint.childNodes[0]
      inside.setAttribute('fill', 'white')
      this.nextLines.push(info.line)
    }
    if (position === 'begin') {
      info.line.beginNode = this
    } else {
      info.line.endNode = this
    }
  }

  updateRelativeLines(x: number, y: number) {
    // tip: update preNode nextNode line

    this.preLines.forEach((line: Line) => {
      const [ix, iy] = this.getPrePointPosition()
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
      const [ix, iy] = this.getParamPosition(index, true)
      if (param.isBeign) {
        param.linkedLine.update(new Point(ix, iy), param.linkedLine._end)
      } else {
        param.linkedLine.update(param.linkedLine._begin, new Point(ix, iy))
      }
    })
    // tip: update outPoints line
    this.outPutPoints.forEach((param: Param, index) => {
      if (!param.linkedObjects) return
      const [ix, iy] = this.getParamPosition(index, false)
      if (param.isBeign) {
        param.linkedObjects.forEach((item) => {
          item.line.update(new Point(ix, iy), item.line._end)
        })
      } else {
        param.linkedObjects.forEach((item) => {
          item.line.update(item.line._begin, new Point(ix, iy))
        })
      }
    })
  }
}
