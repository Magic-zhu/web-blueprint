import { BaseNode } from "../base/baseNode"
import { createDiv, createSpan, createSvg } from "../dom/create"
import IO from "../base/IO"
import { Line } from "./Line"
import { Point } from "../base/Point"
import { LinkedObject, Param } from "./Param"
import { ConnectInfo, ConnectPosition, LineType } from "../gtypes"

export interface InputParam {
  type: string
  value?: any
  name: string
}

export interface OutputParam {
  type: string
  value?: any
  name: string
}

export interface NodeParams {
  nodeName: string
  nodeLabel?: string
  headerClass?: string
  color?: string
  preNodeRequired?: boolean
  nextNodeRequired?: boolean
  input?: InputParam[]
  output?: OutputParam[]
  x?: number
  y?: number
  func: any
}

export interface Position {
  x: number
  y: number
}

export interface NodeSerialization {
  nodeId: string
  nodeName: string
  nodeType: string
  nodeLabel?: string
  x: number
  y: number
  /**
   * * all the string is special
   * * example:  A-B-C-D-E-F-G-H
   * * A ->  id string
   * * B ->  connect type  param or node
   * * C ->  beginNode or endNode
   * * D ->  begin x
   * * E ->  begin y
   * * F ->  end x
   * * G ->  end y
   */
  preNodeIds: string[]
  nextNodeIds: string[]
  inputParamsIds: string[]
  outputParamsIds: string[]
}

export class Node extends BaseNode {
  // * The ui part
  instance: HTMLElement
  header: HTMLElement
  label: HTMLElement
  body: HTMLElement
  leftBody: HTMLElement
  rightBody: HTMLElement
  prePoint: SVGElement
  nextPoint: SVGElement
  headerClass: string = "wb-container-base-header"
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

    if (params.nodeLabel) {
      this.initLabel(params.nodeLabel)
    }
  }

  // ? *********************************
  // ? ********** Attributes **************
  // ? *********************************

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
      this.instance.className = this.instance.className + " " + "selected"
    } else {
      this.instance.className = this.instance.className.replace(" selected", "")
    }
  }

  set position(pos: Position) {
    this.x = pos.x
    this.y = pos.y
    this.updateRelativeLines(pos.x, pos.y)
  }

  get nodeLabel() {
    return this._nodeLabel
  }

  set nodeLabel(label: string) {
    this._nodeLabel = label
    if (this.label) {
      this.label.innerText = label
    } else {
      this.initLabel(label)
    }
  }

  // ? *********************************
  // ? ********** Methods **************
  // ? *********************************

  initContainer() {
    const div = createDiv()
    div.className = "wb-container-base"
    this.instance = div
    this.instance.addEventListener("mousedown", () => {
      IO.emit("NodeActive", this)
    })
    this.instance.addEventListener("mouseup", () => {
      IO.emit("NodeInactive", this)
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
    div.className = "wb-container-base-body"
    const left = createDiv()
    left.className = "wb-container-base-body-left"
    const right = createDiv()
    right.className = "wb-container-base-body-right"
    div.appendChild(left)
    div.appendChild(right)
    this.leftBody = left
    this.rightBody = right
    this.body = div
  }

  initPrePoint(ifNeed: boolean) {
    const svg: SVGElement = createSvg("svg")
    svg.setAttribute("class", "wb-prePoint")
    if (!ifNeed) {
      this.prePoint = svg
      return
    }
    const polygon: SVGPolygonElement = createSvg("polygon")
    polygon.setAttribute("points", "0,0 0,10 5,10 9,5 5,0")
    polygon.setAttribute("stroke-width", "2px")
    polygon.setAttribute("stroke", "white")
    polygon.setAttribute("fill", "none")
    svg.appendChild(polygon)
    svg.addEventListener("mousedown", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    svg.addEventListener("mouseup", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    svg.addEventListener("click", (ev: MouseEvent) => {
      ev.stopPropagation()
      const info = {
        pos: this.getPrePointPosition(),
        node: this,
        isPre: true,
      }
      IO.emit("ConnectPointClick", info)
    })
    svg.addEventListener("contextmenu", (ev: MouseEvent) => {
      IO.emit("PreConnectPointRightClick", ev)
      ev.stopPropagation()
      ev.preventDefault()
    })
    svg.addEventListener("mouseenter", () => {
      IO.emit("ConnectPointEnter", {
        node: this,
        isPre: true,
      })
    })
    svg.addEventListener("mouseleave", () => {
      IO.emit("ConnectPointLeave", {
        node: this,
        isPre: true,
      })
    })
    this.prePoint = svg
  }

  initNextPoint(ifNeed: boolean) {
    const svg: SVGElement = createSvg("svg")
    svg.setAttribute("class", "wb-nextPoint")
    if (!ifNeed) {
      this.nextPoint = svg
      return
    }
    const polygon: SVGPolygonElement = createSvg("polygon")
    polygon.setAttribute("points", "0,0 0,10 5,10 9,5 5,0")
    polygon.setAttribute("stroke-width", "2px")
    polygon.setAttribute("stroke", "white")
    polygon.setAttribute("fill", "none")
    svg.appendChild(polygon)
    svg.addEventListener("mousedown", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    svg.addEventListener("mouseup", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    svg.addEventListener("click", (ev: MouseEvent) => {
      ev.stopPropagation()
      const info = {
        pos: this.getNextPointPosition(),
        node: this,
        isPre: false,
      }
      IO.emit("ConnectPointClick", info)
    })
    svg.addEventListener("contextmenu", (ev: MouseEvent) => {
      IO.emit("NextConnectPointRightClick", ev, this)
      ev.stopPropagation()
      ev.preventDefault()
    })
    this.nextPoint = svg
  }

  initInput({ type, value, name }, index: number) {
    const box = new Param({ type, value, name, indexInParent: index })
    box.instance.addEventListener("mousedown", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    box.instance.addEventListener("mouseup", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    box.point.instance.addEventListener("click", (ev: MouseEvent) => {
      IO.emit("ParamPointClick", {
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

  initOutput({ type, value, name }, index: number) {
    const box = new Param({
      type,
      value,
      name,
      isInput: false,
      indexInParent: index,
    })
    box.instance.addEventListener("mousedown", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    box.instance.addEventListener("mouseup", (ev: MouseEvent) => {
      ev.stopPropagation()
    })
    box.point.instance.addEventListener("click", (ev: MouseEvent) => {
      if (box.type !== "process") {
        IO.emit("ParamPointClick", {
          pos: this.getParamPosition(index, false),
          node: this,
          param: box,
        })
      } else {
        IO.emit("ProcessPointClick", {
          pos: this.getParamPosition(index, false),
          node: this,
          param: box,
        })
      }
    })
    return box
  }

  addOutput(param: Param) {
    this.outPutPoints.push(param)
    param.parent = this
    this.rightBody.appendChild(param.instance)
  }

  initLabel(labelText: string) {
    const label = createSpan()
    this.label = label
    label.setAttribute("class", "wb-container-base-header-label")
    this.header.append(label)
    this.nodeLabel = labelText
  }

  connect(info: ConnectInfo, position: ConnectPosition) {
    if (info.isPre) {
      this.preNodes.push(info.node)
      const inside: any = this.prePoint.childNodes[0]
      inside.setAttribute("fill", "white")
      this.preLines.push(info.line)
    } else {
      this.nextNodes.push(info.node)
      const inside: any = this.nextPoint.childNodes[0]
      inside.setAttribute("fill", "white")
      this.nextLines.push(info.line)
    }
    if (position === ConnectPosition.BEGIN) {
      info.line.beginNode = this
    } else {
      info.line.endNode = this
    }
  }

  updateRelativeLines(x: number, y: number) {
    // tip: update preNode nextNode line

    this.preLines.forEach((line: Line) => {
      const [ix, iy] = this.getPrePointPosition()
      if (line.beginNode?.nodeId === this.nodeId) {
        line.update(new Point(ix, iy), line._end)
      } else {
        line.update(line._begin, new Point(ix, iy))
      }
    })
    this.nextLines.forEach((line: Line) => {
      const [ix, iy] = this.getNextPointPosition()
      if (line.beginNode?.nodeId === this.nodeId) {
        line.update(new Point(ix, iy), line._end)
      } else {
        line.update(line._begin, new Point(ix, iy))
      }
    })
    // tip: update inputPoints line
    this.inputPoints.forEach((param: Param, index) => {
      if (!param.linkedLine) return
      const [ix, iy] = this.getParamPosition(index, true)
      if (param.isBegin) {
        param.linkedLine.update(new Point(ix, iy), param.linkedLine._end)
      } else {
        param.linkedLine.update(param.linkedLine._begin, new Point(ix, iy))
      }
    })
    // tip: update outPoints line
    this.outPutPoints.forEach((param: Param, index) => {
      if (!param.linkedObjects) return
      const [ix, iy] = this.getParamPosition(index, false)
      if (param.isBegin) {
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

  // ! step1 find the relative node, then delete from self
  // ! step2 find the relativev line, delete from self and editor
  /**
   *
   * @param id - the relative node id ,not self.nodeId
   * @param isPre
   * @returns
   */
  disConnect(id: string, isPre: boolean) {
    let relativeNode: Node
    if (isPre) {
      const index = this.preNodes.findIndex((item) => item.nodeId === id)
      if (index === -1) return
      relativeNode = this.preNodes[index] as Node
      this.preNodes.splice(index, 1)
      const lineIndex = this.preLines.findIndex((item) => {
        return item.beginNode.nodeId === id || item.endNode.nodeId === id
      })
      if (lineIndex === -1) return
      IO.emit("LineRemove", this.preLines[lineIndex].id)
      this.preLines.splice(lineIndex, 1)
    } else {
      const index = this.nextNodes.findIndex((item) => item.nodeId === id)
      if (index === -1) return
      relativeNode = this.nextNodes[index] as Node
      this.nextNodes.splice(index, 1)
      const lineIndex = this.nextLines.findIndex((item) => {
        return item.beginNode.nodeId === id || item.endNode.nodeId === id
      })
      if (lineIndex === -1) return
      IO.emit("LineRemove", this.nextLines[lineIndex].id)
      this.nextLines.splice(lineIndex, 1)
    }
    this.callRelativeNodeDisconnect(relativeNode, !isPre)
    this.updatePreOrNextConnectedStatus()
  }

  private callRelativeNodeDisconnect(node: Node, isPre: boolean) {
    node.disConnect(this.nodeId, isPre)
    node.updatePreOrNextConnectedStatus()
  }

  private updatePreOrNextConnectedStatus() {
    // ! maybe undefined
    const child1 = this.prePoint.children[0] as SVGAElement
    const child2 = this.nextPoint.children[0] as SVGAElement
    if (child1) {
      if (this.preLines.length === 0) {
        child1.setAttribute("fill", "none")
      } else {
        child1.setAttribute("fill", "white")
      }
    }

    if (this.nextLines.length === 0) {
      child2.setAttribute("fill", "none")
    } else {
      child2.setAttribute("fill", "white")
    }
  }

  serialize(): string {
    const container: NodeSerialization = {
      nodeId: this.nodeId,
      nodeName: this.nodeName,
      nodeType: this.nodeType,
      nodeLabel: this.nodeLabel,
      x: this.x,
      y: this.y,
      preNodeIds: [],
      nextNodeIds: [],
      inputParamsIds: [],
      outputParamsIds: [],
    }
    // * record the preNode relationship
    container.preNodeIds = this.preNodes.map((node, index) => {
      return `${node.nodeId}-node-${this.getSerializationStringFromLine(
        this.preLines[index]
      )}`
    })

    // * record the nextNode relationship
    container.nextNodeIds = this.nextNodes.map((node, index) => {
      return `${node.nodeId}-node-${this.getSerializationStringFromLine(
        this.nextLines[index]
      )}`
    })

    // * record the inputParams's relationship
    // todo
    // ! if noting , its null ex: [null]
    container.inputParamsIds = this.inputPoints.map((param) => {
      if (!param.linkedLine) return null
      return param.serialize()
    })
    // * record the outputParams's relationship
    container.outputParamsIds = this.outPutPoints.map((param) => {
      return param.serialize()
    })
    console.log("序列化信息", container)
    return JSON.stringify(container)
  }

  private getSerializationStringFromLine(line: Line): string {
    const isBeginNode = this.equal(line.beginNode)
    let t =
      isBeginNode +
      "-" +
      line.begin.x +
      "-" +
      line.begin.y +
      "-" +
      line.end.x +
      "-" +
      line.end.y +
      "-" +
      line.type
    if (line.type === LineType.ParamToNode) {
      const index = line.beginParam
        ? line.beginParam.indexInParent
        : line.endParam.indexInParent
      t = t + "-" + index
    }
    return t
  }

  setNodeName(val: string) {
    this.header.innerText = val
    this.nodeName = val
  }
}
