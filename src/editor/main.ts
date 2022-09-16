import {Line, Node} from 'src'
import IO from 'src/blueprint/IO'
import {createSvg} from 'src/dom/create'

export enum MouseDownType {
  'LEFT' = 0,
  'RIGHT' = 2,
  'NONE' = -1,
}

export interface ITransform {
  transformOrigin?: string
  translate?: number[]
}
export class BluePrintEditor {
  container: HTMLElement
  lineContainer: SVGAElement
  // @ 当前画布的缩放系数
  private scale: number = 1
  private _orginSize: number[] = []
  // @ 当前点击的类型
  private _mouseDownType: MouseDownType = -1
  // @ 当前点击的坐标位置
  private _mouseDownPosition: number[] = []
  // @ 最后一次移动时的参数
  private _translateLast: number[] = []
  // @ save the transform data temporary
  // @ 临时存放transform数据
  private _transform: ITransform = {
    translate: [0, 0],
    transformOrigin: '0px 0px',
  }
  constructor(container) {
    IO.on('')
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
      IO.emit('mouseup', ev)
    })
    this.container.addEventListener('mousemove', (ev) => {
      if (this._mouseDownType == MouseDownType.RIGHT) {
        this.translate(ev)
      }
      IO.emit('mousemove', ev)
    })
    this.container.addEventListener('mousewheel', (ev: any) => {
      if (ev.deltaY < 0) {
        this.scale += 0.1
        this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
        this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
      } else {
        this.scale -= 0.1
        this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
        this.container.style.transform = `translate(${this._transform.translate[0]}px, ${this._transform.translate[1]}px) scale(${this.scale})`
      }
      this.resize(this.scale)
    })
  }

  add(node: Node): void {
    this.container.appendChild(node.container)
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
    this._mouseDownPosition = [x, y]
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
}
