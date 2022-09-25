import {Line, Node, Point} from 'src'
import IO from 'src/base/IO'
import {createSvg} from 'src/dom/create'
import {mat3, vec2} from 'gl-matrix'

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
export class BluePrintEditor {
  container: HTMLElement
  lineContainer: SVGAElement
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
  // @ 连线断点对象
  private beginNode: Node
  // @ 当前操作的线
  private currentLine: Line

  constructor(container) {
    // # hook
    IO.emit('beforeCreated')
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
        console.log(info)
        this.currentTarget = info.node
        if (this.currentEventType !== EditorEventType.LineBegin) {
          this.currentEventType = EditorEventType.LineBegin
          //@ 记录一下开始端点
          this.beginNode = info.node

          const t = new Line(
            new Point(info.pos[0], info.pos[1]),
            new Point(info.pos[0], info.pos[1]),
          )
          this.currentLine = t
          this.addLine(t)
        } else {
          this.currentEventType = EditorEventType.LineEnd
          this.currentLine.update(
            this.currentLine._begin,
            new Point(info.pos[0], info.pos[1]),
          )
          this.lineGraph.push(this.currentLine)
          // @ 连接信息注入
          info.node = this.beginNode
          info.line = this.currentLine
          this.currentTarget.connect(info)
          info.isPre = !info.isPre
          info.node = this.currentTarget
          info.node = this.beginNode.connect(info)
          this.beginNode = null
          this.currentLine = null
          this.currentEventType = EditorEventType.Normal
        }
      },
      {only: true},
    )
    IO.on('ConnectPointEnter', (info) => {}, {only: true})
    // preventDefault
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
      this.recordPosition(ev.clientX, ev.clientY)
    })
    this.container.addEventListener('mouseup', (ev) => {
      this._mouseDownType = -1
      this._transform.translate = [...this._translateLast]
      this._mouseDownPosition = []
      if (this.currentEventType === EditorEventType.LineBegin) {
        this.currentLine.destory()
        this.currentLine = null
        this.currentEventType = EditorEventType.Normal
      }
    })
    // @ 处理鼠标移动事件
    this.container.addEventListener('mousemove', (ev) => {
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
      }
      // @ 连线模式
      if (this.currentEventType === EditorEventType.LineBegin) {
        const [ox, oy] = this.getScaleOffset(
          ev.clientX - this._translateLast[0],
          ev.clientY - this._translateLast[1],
        )
        this.currentLine.update(this.currentLine._begin, new Point(ox, oy))
      }
    })
    // @ 处理滚轮事件
    this.container.addEventListener('mousewheel', (ev: any) => {
      this.ScaleHandler(ev)
      this.resize(this.scale)
    })
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

  resize(scale: number) {
    // this.container.style.width = this._orginSize[0] / scale + 'px'
    // this.container.style.height = this._orginSize[1] / scale + 'px'
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
      if (this.scale < 0.3) return
      this.scale -= 0.1
      this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
      this._transform.transformOrigin = `${ev.x}px ${ev.y}px`
      this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
    }
  }

  private NodeMoveHandler(ev: MouseEvent) {
    this.currentTarget.position = {
      x: ev.clientX - this._mouseDownPosition[0] + this._mouseDownPosition[2],
      y: ev.clientY - this._mouseDownPosition[1] + this._mouseDownPosition[3],
    }
  }

  private NodeActiveHandler(node: Node) {
    this.currentEventType = EditorEventType.NodeActive
    this.currentTarget = node
    this._mouseDownPosition[0] = 0
    this._mouseDownPosition[1] = 0
    this._mouseDownPosition[2] = node.x
    this._mouseDownPosition[3] = node.y
  }

  // @ 获取坐标偏移量
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
}
