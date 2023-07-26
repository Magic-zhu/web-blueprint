import { Line } from "../base/Line"
import { Node, NodeSerialization } from "../base/Node"
import { ConnectPosition, LineType } from "../gtypes"
import IO from "../base/IO"
import { createSvg } from "../dom/create"
import { mat3, vec2 } from "gl-matrix"
import { Param } from "../base/Param"
import { Selector } from "./Selector"
import { intersection_rectangle } from "stl-typescript"
import { NodeConnectType } from "../base/Line"
import { LogMsg } from "./LogMsg"
import { Point } from "../base/Point"
import {
  BeginType,
  ClickInfo,
  EditorEventType,
  ITransform,
  MouseDownType,
  NodeMap,
  ConnectInfo,
} from "../gtypes"

export class BluePrintEditor {
  container: HTMLElement
  lineContainer: SVGAElement
  selector: Selector
  msgLogger: LogMsg = new LogMsg()
  graph: Node[] = []
  lineGraph: Line[] = []
  nodeMap: NodeMap = {}
  // @ 当前画布的缩放系数
  private scale: number = 1
  // @ 画布原始大小
  private _orginSize: number[] = []
  // @ 画布距离body位置
  private left: number = 0
  private top: number = 0
  // @ 当前点击的类型
  private _mouseDownType: MouseDownType = -1
  // @ 当前点击的坐标位置
  private _mouseDownPosition: number[] = []
  // @ 最后一次移动时的参数
  private _translateLast: number[] = [0, 0]
  // @ 临时存放transform数据
  private _transform: ITransform = {
    translate: [0, 0],
    transformOrigin: "0px 0px",
  }

  // @ 当前画布事件状态
  private currentEventType: EditorEventType = EditorEventType.Normal
  // @ 当前操作对象
  private currentTarget: Node
  // @ 连线起始点对象
  private beginNode: Node
  // @ 连线起始参数对象
  private beginParam: Param
  // @ 连线起始类型
  private beginType: string
  // @ 当前操作的线
  private currentLine: Line

  // @ 右键监听
  onRightClick: Function

  // @ 是否允许缩放画布
  public scaleDisabled: boolean = true

  //  @ 暴露给外部订阅hook
  public hook = IO

  constructor(container: HTMLElement, nodeMap: NodeMap = {}) {
    // @ hook
    IO.emit("beforeCreated")
    IO.on("LineRemove", (id: string) => {
      const index = this.lineGraph.findIndex((item) => item.id)
      if (index === -1) return
      const line = this.lineGraph[index]
      this.lineGraph.splice(index, 1)
      line.destroy()
    })
    IO.on(
      "NodeActive",
      (node: Node) => {
        if (this.currentEventType === EditorEventType.LineBegin) return
        this.NodeActiveHandler(node)
      },
      { only: true }
    )
    IO.on(
      "NodeInactive",
      () => {
        if (this.currentEventType !== EditorEventType.LineBegin) {
          this.currentEventType = EditorEventType.Normal
        }
        this.currentTarget = null
      },
      { only: true }
    )
    IO.on(
      "ConnectPointClick",
      (info: any) => {
        this.handleConnectPointClick(info)
      },
      { only: true }
    )
    IO.on(
      "ParamPointClick",
      (info: any) => {
        this.paramPointClickHandler(info)
      },
      { only: true }
    )
    IO.on(
      "ProcessPointClick",
      (info: ClickInfo) => {
        this.processPointClickHandler(info)
      },
      { only: true }
    )
    IO.on("ConnectPointEnter", (info) => {}, { only: true })
    // !! preventDefault
    container.oncontextmenu = function (ev) {
      IO.emit("GlobalConextMenu", ev)
      return false
    }
    this.container = container
    this.nodeMap = nodeMap
    this._orginSize[0] = this.container.getClientRects()[0].width
    this._orginSize[1] = this.container.getClientRects()[0].height
    this.left = this.container.getClientRects()[0].left
    this.top = this.container.getClientRects()[0].top
    container.style.position = "relative"
    container.style.transform = "scale(1)"
    this.initLineContainer()
    this.init()
  }

  private init() {
    this.container.addEventListener("mousedown", (ev: MouseEvent) => {
      this.setMouseDownType(ev.button)
      // @ hook rightclick
      if (this.onRightClick && ev.button === 2) {
        this.onRightClick()
      }
      this.recordPosition(ev.clientX, ev.clientY)
    })
    document.body.addEventListener("mouseup", (ev) => {
      this._mouseDownType = -1
      this._transform.translate = [...this._translateLast]
      this._mouseDownPosition = []
      this.selector.hidden()
      if (this.currentEventType === EditorEventType.LineBegin) {
        this.currentLine.destroy()
        this.currentLine = null
        this.currentEventType = EditorEventType.Normal
        this.resetAfterAttachLine()
      }
    })

    // @ 处理鼠标移动事件
    document.body.addEventListener("mousemove", (ev: MouseEvent) => {
      // @ 移动画布
      if (this._mouseDownType == MouseDownType.RIGHT) {
        this.translate(ev)
        return
      }
      // @ 移动节点
      if (
        this._mouseDownType == MouseDownType.LEFT &&
        this.currentEventType == EditorEventType.NodeActive &&
        this._mouseDownPosition[0] != 0
      ) {
        this.NodeMoveHandler(ev)
        return
      }
      // @ 连线模式
      if (this.currentEventType === EditorEventType.LineBegin) {
        const [ox, oy] = this.getScaleOffset(
          this.reviseClientX(ev.clientX) - this._translateLast[0],
          this.reviseClientY(ev.clientY) - this._translateLast[1]
        )
        this.currentLine.update(this.currentLine._begin, new Point(ox, oy))
        return
      }
      // @ 框选模式
      if (
        this._mouseDownType === MouseDownType.LEFT &&
        this.currentEventType === EditorEventType.Normal
      ) {
        const ow = ev.clientX - this._mouseDownPosition[0]
        const oh = ev.clientY - this._mouseDownPosition[1]
        if (this.selector.isHidden === true) {
          this.selector.show()
        }
        this.selector.update(
          this._mouseDownPosition[0],
          this._mouseDownPosition[1],
          ow,
          oh
        )
        this.SelectHandler(
          this.selector.x,
          this.selector.y,
          this.selector.width,
          this.selector.height
        )
      }
    })
    // @ 处理滚轮事件
    this.container.addEventListener("mousewheel", (ev: any) => {
      this.ScaleHandler(ev)
    })

    this.selector = new Selector()
  }

  add(node: Node): void {
    this.container.appendChild(node.instance)
    this.graph.push(node)
  }

  addLine(line: Line): void {
    this.lineContainer.appendChild(line.instance)
  }

  translate(ev: MouseEvent) {
    const goalX =
      ev.clientX - this._mouseDownPosition[0] + this._transform.translate[0]
    const goalY =
      ev.clientY - this._mouseDownPosition[1] + this._transform.translate[1]
    this.container.style.transform = `translate(${goalX}px, ${goalY}px) scale(${this.scale})`
    this._translateLast = [goalX, goalY]
  }

  private setMouseDownType(type: MouseDownType): void {
    if (type === 2) {
      this._mouseDownType = 2
    } else if (type === 0) {
      this._mouseDownType = 0
    }
  }

  private recordPosition(x: number, y: number) {
    this._mouseDownPosition[0] = x
    this._mouseDownPosition[1] = y
  }

  private initLineContainer() {
    const svg = createSvg("svg")
    svg.style.width = this.container.getClientRects()[0].width + "px"
    svg.style.height = this.container.getClientRects()[0].height + "px"
    svg.style.left = 0
    svg.style.top = 0
    this.lineContainer = svg
    this.container.appendChild(this.lineContainer)
  }

  private PreNodeHandler() {}

  // @ 画布缩放
  private ScaleHandler(ev: WheelEvent) {
    if (this.scaleDisabled) return
    if (ev.deltaY < 0) {
      if (this.scale >= 1) return
      this.scale += 0.1
      this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
      this._transform.transformOrigin = `${ev.x}px ${ev.y}px`
      this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
    } else {
      if (this.scale <= 0.7) return
      this.scale -= 0.1
      this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
      this._transform.transformOrigin = `${ev.x}px ${ev.y}px`
      this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
    }
  }

  // @ 处理节点移动
  private NodeMoveHandler(ev: MouseEvent) {
    this.currentTarget.position = {
      x: ev.clientX - this._mouseDownPosition[0] + this._mouseDownPosition[2],
      y: ev.clientY - this._mouseDownPosition[1] + this._mouseDownPosition[3],
    }
  }

  // @ 处理节点激活
  private NodeActiveHandler(node: Node) {
    this.currentEventType = EditorEventType.NodeActive
    this.currentTarget = node
    this._mouseDownPosition[0] = 0
    this._mouseDownPosition[1] = 0
    this._mouseDownPosition[2] = node.x
    this._mouseDownPosition[3] = node.y
  }

  // @ 获取缩放坐标偏移量
  private getScaleOffset(x: number, y: number) {
    const originOffset: string[] = this._transform.transformOrigin
      .replace(/px/g, "")
      .split(" ")
    const xc = +originOffset[0]
    const yc = +originOffset[1]
    // @ 先平移到缩放中心再平移回来
    const m1: mat3 = [1, 0, 0, 0, 1, 0, xc, yc, 1]
    const m2: mat3 = [1 / this.scale, 0, 0, 0, 1 / this.scale, 0, 0, 0, 1]
    const m3: mat3 = [1, 0, 0, 0, 1, 0, -xc, -yc, 1]
    let m4: mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    let m5: mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    mat3.multiply(m4, m1, m2)
    mat3.multiply(m5, m4, m3)
    const r: vec2 = [0, 0]
    vec2.transformMat3(r, [x, y], m5)
    return [...r]
  }

  private getScaleOffset_T(x: number, y: number) {
    const originOffset: string[] = this._transform.transformOrigin
      .replace(/px/g, "")
      .split(" ")
    const xc = +originOffset[0]
    const yc = +originOffset[1]
    // @ 先平移到缩放中心再平移回来
    const m1: mat3 = [1, 0, 0, 0, 1, 0, xc, yc, 1]
    const m2: mat3 = [1 * this.scale, 0, 0, 0, 1 * this.scale, 0, 0, 0, 1]
    const m3: mat3 = [1, 0, 0, 0, 1, 0, -xc, -yc, 1]
    let m4: mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    let m5: mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    mat3.multiply(m4, m1, m2)
    mat3.multiply(m5, m4, m3)
    const r: vec2 = [0, 0]
    vec2.transformMat3(r, [x, y], m5)
    return [...r]
  }

  private isLineBegin(): boolean {
    return this.currentEventType === EditorEventType.LineBegin
  }

  // @ 连接节点点击处理
  private handleConnectPointClick(info: ClickInfo): void {
    this.currentTarget = info.node
    if (!this.isLineBegin()) {
      this.currentEventType = EditorEventType.LineBegin
      // @ 记录一下开始端点
      this.beginNode = info.node
      // @ 记录一下开始端点类型
      this.beginType = BeginType.NODE
      const t = new Line(
        new Point(info.pos[0], info.pos[1]),
        new Point(info.pos[0], info.pos[1])
      )
      // @ 记录连接点是next还是pre
      t.beginNodeConnectType = info.isPre
        ? NodeConnectType.PRE
        : NodeConnectType.NEXT
      this.currentLine = t
      this.addLine(t)
    } else {
      // * enter process mode
      if (this.beginType === BeginType.PROCESS) {
        this.currentEventType = EditorEventType.LineEnd
        this.currentLine.update(
          this.currentLine._begin,
          new Point(info.pos[0], info.pos[1])
        )
        this.currentLine.beginNode = this.beginNode
        this.currentLine.beginParam = this.beginParam
        this.lineGraph.push(this.currentLine)
        this.beginParam.connect(
          this.currentLine,
          info.node,
          ConnectPosition.BEGIN
        )
        info.line = this.currentLine
        info.line.type = LineType.ParamToNode
        info.node.connect(info, ConnectPosition.END)
        this.resetAfterAttachLine()
        return
      }

      // * enter node mode
      if (this.beginType !== BeginType.NODE) return
      const endPointConnectType = info.isPre
        ? NodeConnectType.PRE
        : NodeConnectType.NEXT
      // ? 检查是否是相同类型连接点 不可连接
      if (this.currentLine.beginNodeConnectType === endPointConnectType) return
      // 切换状态
      this.currentEventType = EditorEventType.LineEnd
      // 更新线的end point
      this.currentLine.endNodeConnectType = endPointConnectType
      this.currentLine.update(
        this.currentLine._begin,
        new Point(info.pos[0], info.pos[1])
      )
      this.lineGraph.push(this.currentLine)
      // 连接信息注入
      info.node = this.beginNode
      info.line = this.currentLine
      info.line.type = LineType.NodeToNode
      this.currentTarget.connect(info, ConnectPosition.END)
      info.isPre = !info.isPre
      info.node = this.currentTarget
      this.beginNode.connect(info, ConnectPosition.BEGIN)
      this.resetAfterAttachLine()
    }
  }

  // @ 参数节点击处理
  private paramPointClickHandler(info: ClickInfo): void {
    this.currentTarget = info.node
    // # normal mode
    if (this.currentEventType !== EditorEventType.LineBegin) {
      this.currentEventType = EditorEventType.LineBegin
      //@ 记录一下开始端点
      this.beginParam = info.param
      this.beginNode = info.node
      this.beginType = BeginType.PARAM
      const t = new Line(
        new Point(info.pos[0], info.pos[1]),
        new Point(info.pos[0], info.pos[1]),
        { color: info.param.point.color }
      )

      // @ 记录连接点是next还是pre
      t.beginNodeConnectType = info.param.isInput
        ? NodeConnectType.PRE
        : NodeConnectType.NEXT

      this.currentLine = t
      t.beginParam = info.param
      this.addLine(t)
    } else {
      if (this.beginType !== BeginType.PARAM) return
      // @ 类型不同或者 不是通配类型 则不继续
      if (
        info.param.type !== this.beginParam.type &&
        info.param.type !== "any"
      ) {
        return
      }
      if (info.param.isConnected) return
      // % 将线更新注入到lineGraph中
      this.currentEventType = EditorEventType.LineEnd
      this.currentLine.update(
        this.currentLine._begin,
        new Point(info.pos[0], info.pos[1])
      )
      this.currentLine.endParam = info.param
      this.lineGraph.push(this.currentLine)
      // % 连接信息注入
      this.beginParam.connect(
        this.currentLine,
        info.param,
        ConnectPosition.BEGIN
      )
      this.currentLine.type = LineType.ParamToParam
      info.param.connect(this.currentLine, this.beginParam, ConnectPosition.END)
      this.resetAfterAttachLine()
    }
  }

  // @ 流程节点点击处理
  private processPointClickHandler(info: ClickInfo): void {
    this.currentTarget = info.node
    if (this.currentEventType !== EditorEventType.LineBegin) {
      this.currentEventType = EditorEventType.LineBegin
      //@ 记录一下开始端点
      this.beginParam = info.param
      this.beginNode = info.node
      this.beginType = BeginType.PROCESS
      const t = new Line(
        new Point(info.pos[0], info.pos[1]),
        new Point(info.pos[0], info.pos[1]),
        { color: "white" }
      )
      t.beginNodeConnectType = NodeConnectType.NEXT
      this.currentLine = t
      this.addLine(t)
    } else {
      if (info.param.isConnected) return
      this.currentEventType = EditorEventType.LineEnd
      this.currentLine.update(
        this.currentLine._begin,
        new Point(info.pos[0], info.pos[1])
      )
      this.currentLine.endNode = info.param.parent
      this.currentLine.endParam = info.param
      this.lineGraph.push(this.currentLine)
      info.line = this.currentLine
      info.line.type = LineType.ParamToNode
      info.isPre = true
      this.beginNode.connect(info, ConnectPosition.BEGIN)
      info.param.connect(this.currentLine, this.beginNode, ConnectPosition.END)
      this.resetAfterAttachLine()
    }
  }

  private resetAfterAttachLine() {
    this.beginNode = null
    this.beginParam = null
    this.beginType = null
    this.currentLine = null
    this.currentEventType = EditorEventType.Normal
  }

  private SelectHandler(x: number, y: number, width: number, height: number) {
    this.graph.forEach((item: Node, index) => {
      //  % 当画布缩放的时候需要计算补偿
      const [tx, ty] = this.getScaleOffset_T(item.x, item.y)
      const isT = intersection_rectangle(
        x,
        y,
        width,
        height,
        tx + this._translateLast[0],
        ty + this._translateLast[1],
        item.width * this.scale,
        item.height * this.scale
      )
      if (isT) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
  }

  /**
   *  ! why not use offset
   *  when move over the node its may cause a lot of strange problems
   */
  private reviseClientX(input: number): number {
    return input - this.left
  }

  private reviseClientY(input: number): number {
    return input - this.top
  }

  // ** save all the nodes as string
  save() {
    const t = []
    this.graph.forEach((node) => {
      t.push(node.serialize())
    })
    return t
  }

  // ** restore the data
  restore(data: string[]) {
    let arr = data.map((item) => {
      return JSON.parse(item)
    })

    arr.forEach((element: NodeSerialization) => {
      let node: Node
      if (this.nodeMap[element.nodeName]) {
        node = this.nodeMap[element.nodeName]
      }
      node.setNodeId(element.nodeId, "Vy9YnXy136tFIcfb")
      node.nodeName = element.nodeName
      node.nodeLabel = element.nodeLabel
      node.nodeType = element.nodeType
      node.x = element.x
      node.y = element.y

      this.add(node)
    })

    arr.forEach((element: NodeSerialization, index: number) => {
      element.preNodeIds.forEach((item: string) => {
        this.reconnectBySerializationString(item, index)
      })
      element.inputParamsIds.forEach((item) => {
        if (item) {
        }
      })
    })
  }

  //** clear all the nodes
  clear() {
    this.container.innerHTML = ""
    this.graph = []
    this.lineGraph = []
    this.initLineContainer()
  }

  private getTypeFromSerializationString(serializationString: string): string {
    return serializationString.split("-")[1]
  }

  private getNodeIdFromSerializationString(
    serializationString: string
  ): string {
    return serializationString.split("-")[0]
  }

  private getBeginPointFromSerializationString(
    serializationString: string
  ): Point {
    const n = serializationString.split("-")
    return new Point(+n[3], +n[4])
  }

  private getEndPointFromSerializationString(
    serializationString: string
  ): Point {
    const n = serializationString.split("-")
    return new Point(+n[5], +n[6])
  }

  private getIsBeginNodeFromSerializationString(
    serializationString: string
  ): boolean {
    return serializationString.split("-")[2] === "false" ? false : true
  }

  private getLineTypeFromSerializationString(
    serializationString: string
  ): string {
    return serializationString.split("-")[7]
  }

  private getParamIndexFromSerializationString(serializationString: string) {
    return serializationString.split("-")[8]
  }

  private findTargetIndexByNodeId(nodeId: string): number {
    return this.graph.findIndex((it) => it.nodeId === nodeId)
  }

  private reconnectBySerializationString(item: string, index: number): void {
    const type = this.getLineTypeFromSerializationString(item)

    // * 和流程参数连接的情况
    if (type === LineType.ParamToNode) {
    } else {
      // * 正常节点和节点之间的连接
      // % find which is the target node
      const targetIndex = this.findTargetIndexByNodeId(
        this.getNodeIdFromSerializationString(item)
      )
      let line: Line
      if (this.getIsBeginNodeFromSerializationString(item)) {
        line = new Line(
          this.getBeginPointFromSerializationString(item),
          this.getEndPointFromSerializationString(item)
        )
      } else {
        line = new Line(
          this.getEndPointFromSerializationString(item),
          this.getBeginPointFromSerializationString(item)
        )
      }
      line.beginNodeConnectType = NodeConnectType.PRE
      line.endNodeConnectType = NodeConnectType.NEXT
      this.addLine(line)
      const connectInfo: ConnectInfo = {
        pos: [],
        node: this.graph[targetIndex],
        line: line,
        isPre: true,
      }
      const connectInfo2: ConnectInfo = {
        pos: [],
        node: this.graph[index],
        line: line,
        isPre: false,
      }
      this.graph[index].connect(connectInfo, ConnectPosition.BEGIN)
      this.graph[targetIndex].connect(connectInfo2, ConnectPosition.END)
    }
  }
}
