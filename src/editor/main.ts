import {Line, Node, Point} from 'src'
import IO from 'src/base/IO'
import {createSvg} from 'src/dom/create'
import {mat3, vec2} from 'gl-matrix'
import {Param} from 'src/node/Param'
import {Selector} from './Selector'
import {intersection_rectangle} from 'stl-typescript/index'
import {NodeConnectType} from 'src/base/BaseLine'
import {LogMsg} from './LogMsg'

export enum MouseDownType {
  'LEFT' = 0,
  'RIGHT' = 2,
  'NONE' = -1,
}

export enum EditorEventType {
  'Normal' = 'normal',
  // @ 节点被按下
  'NodeActive' = 'NodeActive',
  // @ 开始连线的第一个点
  'LineBegin' = 'LineBegin',
  // @ 连线时的结束点
  'LineEnd' = 'LineEnd',
}

export interface ITransform {
  transformOrigin?: string
  translate?: number[]
}

export interface EventInfo {
  node?: Node
  pos?: number[]
  isPre?: boolean
}

export interface ClickInfo {
  pos: number[]
  isPre?: boolean
  node: Node
  param?: Param
  line?: Line
}

export enum BeginType {
  NODE = 'node',
  PARAM = 'param',
}

export class BluePrintEditor {
  container: HTMLElement
  lineContainer: SVGAElement
  selector: Selector
  msgLogger: LogMsg = new LogMsg()
  graph: Node[] = []
  lineGraph: Line[] = []
  // @ 当前画布的缩放系数
  private scale: number = 1
  // @ 画布原始大小
  private _orginSize: number[] = []
  // @ 当前点击的类型
  private _mouseDownType: MouseDownType = -1
  // @ 当前点击的坐标位置
  private _mouseDownPosition: number[] = []
  // @ 最后一次移动时的参数
  private _translateLast: number[] = [0, 0]
  // @ 临时存放transform数据
  private _transform: ITransform = {
    translate: [0, 0],
    transformOrigin: '0px 0px',
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

  constructor(container: HTMLElement) {
    // # hook
    IO.emit('beforeCreated')
    IO.on('LineRemove', (id: string) => {
      const index = this.lineGraph.findIndex((item) => item.id)
      if (index === -1) return
      const line = this.lineGraph[index]
      this.lineGraph.splice(index, 1)
      line.destory()
    })
    IO.on(
      'NodeActive',
      (node: Node) => {
        if (this.currentEventType === EditorEventType.LineBegin) return
        this.NodeActiveHandler(node)
      },
      {only: true},
    )
    IO.on(
      'NodeInactive',
      () => {
        if (this.currentEventType !== EditorEventType.LineBegin) {
          this.currentEventType = EditorEventType.Normal
        }
        this.currentTarget = null
      },
      {only: true},
    )
    IO.on(
      'ConnectPointClick',
      (info: any) => {
        this.handleConnectPointClick(info)
      },
      {only: true},
    )
    IO.on(
      'ParamPointClick',
      (info: any) => {
        this.paramPointClickHandler(info)
      },
      {only: true},
    )
    IO.on('ProcessPointClick',(info:ClickInfo)=>{
      this.processPointClickHandler()
    })
    IO.on('ConnectPointEnter', (info) => {}, {only: true})
    // !! preventDefault
    container.oncontextmenu = function () {
      return false
    }
    this.container = container
    this._orginSize[0] = this.container.getClientRects()[0].width
    this._orginSize[1] = this.container.getClientRects()[0].height
    container.style.position = 'relative'
    container.style.transform = 'scale(1)'
    this.initLineContainer()
    this.init()
  }

  private init() {
    this.container.addEventListener('mousedown', (ev: MouseEvent) => {
      this.setMouseDownType(ev.button)
      // @ hook rightclick
      if (this.onRightClick && ev.button === 2) {
        this.onRightClick()
      }
      this.recordPosition(ev.clientX, ev.clientY)
    })
    document.body.addEventListener('mouseup', (ev) => {
      this._mouseDownType = -1
      this._transform.translate = [...this._translateLast]
      this._mouseDownPosition = []
      this.selector.hidden()
      if (this.currentEventType === EditorEventType.LineBegin) {
        this.currentLine.destory()
        this.currentLine = null
        this.currentEventType = EditorEventType.Normal
        this.resetAfterAttachLine()
      }
    })
    // @ 处理鼠标移动事件
    document.body.addEventListener('mousemove', (ev) => {
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
          ev.clientX - this._translateLast[0],
          ev.clientY - this._translateLast[1],
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
          oh,
        )
        this.SelectHandler(
          this.selector.x,
          this.selector.y,
          this.selector.width,
          this.selector.height,
        )
      }
    })
    // @ 处理滚轮事件
    this.container.addEventListener('mousewheel', (ev: any) => {
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
    const svg = createSvg('svg')
    svg.style.width = this.container.getClientRects()[0].width + 'px'
    svg.style.height = this.container.getClientRects()[0].height + 'px'
    svg.style.left = 0
    svg.style.top = 0
    this.lineContainer = svg
    this.container.appendChild(this.lineContainer)
  }

  private PreNodeHandler() {}

  // @ 画布缩放
  private ScaleHandler(ev: WheelEvent) {
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
      .replace(/px/g, '')
      .split(' ')
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
      .replace(/px/g, '')
      .split(' ')
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
        new Point(info.pos[0], info.pos[1]),
      )
      // @ 记录连接点是next还是pre
      t.beginNodeConnectType = info.isPre
        ? NodeConnectType.PRE
        : NodeConnectType.NEXT
      this.currentLine = t
      this.addLine(t)
      console.log(t)
    } else {
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
        new Point(info.pos[0], info.pos[1]),
      )
      this.lineGraph.push(this.currentLine)
      // 连接信息注入
      info.node = this.beginNode
      info.line = this.currentLine
      this.currentTarget.connect(info, 'end')
      info.isPre = !info.isPre
      info.node = this.currentTarget
      this.beginNode.connect(info, 'begin')
      this.resetAfterAttachLine()
    }
  }

  // @ 参数节点击处理
  private paramPointClickHandler(info: ClickInfo): void {
    this.currentTarget = info.node
    if (this.currentEventType !== EditorEventType.LineBegin) {
      this.currentEventType = EditorEventType.LineBegin
      //@ 记录一下开始端点
      this.beginParam = info.param
      this.beginNode = info.node
      this.beginType = BeginType.PARAM
      const t = new Line(
        new Point(info.pos[0], info.pos[1]),
        new Point(info.pos[0], info.pos[1]),
        {color: info.param.point.color},
      )

      // @ 记录连接点是next还是pre
      t.beginNodeConnectType = info.param.isInput
        ? NodeConnectType.PRE
        : NodeConnectType.NEXT

      this.currentLine = t
      this.addLine(t)
    } else {
      if (this.beginType !== BeginType.PARAM) return
      if (info.param.type !== this.beginParam.type) {
        return
      }
      if (info.param.isConnected) return
      // 将线更新注入到lineGraph中
      this.currentEventType = EditorEventType.LineEnd
      this.currentLine.update(
        this.currentLine._begin,
        new Point(info.pos[0], info.pos[1]),
      )
      this.lineGraph.push(this.currentLine)
      // @ 连接信息注入
      this.beginParam.connect(this.currentLine, info.param, 'begin')
      info.param.connect(this.currentLine, this.beginParam, 'end')
      this.resetAfterAttachLine()
    }
  }

  // @ 流程节点点击处理
  private processPointClickHandler():void {

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
      // 当画布缩放的时候需要计算补偿
      const [tx, ty] = this.getScaleOffset_T(item.x, item.y)
      const isT = intersection_rectangle(
        x,
        y,
        width,
        height,
        tx + this._translateLast[0],
        ty + this._translateLast[1],
        item.width * this.scale,
        item.height * this.scale,
      )
      if (isT) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
  }
}
