import {Line, Node} from 'src'
import IO from 'src/blueprint/IO'
import {createSvg} from 'src/dom/create'

export enum MouseDownType {
  'LEFT' = 0,
  'RIGHT' = 2,
  'NONE' = -1,
}

export enum EditorEventType {
  'Normal' = 'normal',
  'NodeSelected' = 'NodeSelected',
  'NodeActive' = 'NodeActive',
}

export interface ITransform {
  transformOrigin?: string
  translate?: number[]
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

  constructor(container) {
    // # hook
    IO.emit('beforeCreated')
    IO.on('NodeSelected', () => {})
    IO.on('NodeActive', (node: Node) => {
      this.currentEventType = EditorEventType.NodeActive
      this.currentTarget = node
      this._mouseDownPosition[0] = 0
      this._mouseDownPosition[1] = 0
      this._mouseDownPosition[2] = node.x
      this._mouseDownPosition[3] = node.y
      console.log(this._mouseDownPosition)
    })
    IO.on('NodeInactive', () => {
      this.currentEventType = EditorEventType.Normal
      this.currentTarget = null
    })
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
      console.log(ev)
    })
    this.container.addEventListener('mouseup', (ev) => {
      this._mouseDownType = -1
      this._transform.translate = [...this._translateLast]
      this._mouseDownPosition = []
      IO.emit('mouseup', ev)
    })
    // @ 处理鼠标移动事件
    this.container.addEventListener('mousemove', (ev) => {
      IO.emit('mousemove', ev)
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
        this.currentTarget.x =
          ev.clientX - this._mouseDownPosition[0] + this._mouseDownPosition[2]
        this.currentTarget.y =
          ev.clientY - this._mouseDownPosition[1] + this._mouseDownPosition[3]
      }
    })
    // @ 处理滚轮事件
    this.container.addEventListener('mousewheel', (ev: any) => {
      this.ScaleHandler(ev)
      this.resize(this.scale)
    })
  }

  add(node: Node): void {
    this.container.appendChild(node.container)
    this.graph.push(node)
  }

  addLine(line: Line): void {
    this.lineContainer.appendChild(line.instance)
    this.lineGraph.push(line)
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
    this.container.style.width = this._orginSize[0] * scale + 'px'
    this.container.style.height = this._orginSize[1] * scale + 'px'
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
      this.scale += 0.1
      this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
      this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
    } else {
      this.scale -= 0.1
      this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
      this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
    }
  }
}
