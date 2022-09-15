import {Line, Node} from 'src'
import IO from 'src/blueprint/IO'
export class BluePrintEditor {
  container: HTMLElement
  scale: number = 1
  private _orginSize: number[] = []
  constructor(container) {
    this.container = container
    this._orginSize[0] = +container.style.width.replace('px', '')
    this._orginSize[0] = +container.style.height.replace('px', '')
    container.style.position = 'relative'
    container.style.transform = 'scale(1)'
    this.container.addEventListener('mouseup', (ev) => {
      IO.emit('mouseup', ev)
    })
    this.container.addEventListener('mousemove', (ev) => {
      IO.emit('mousemove', ev)
    })
    this.container.addEventListener('mousewheel', (ev: any) => {
      if (ev.deltaY < 0) {
        this.scale += 0.1
        this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
        this.container.style.transform = `scale(${this.scale})`
      } else {
        this.scale -= 0.1
        this.container.style.transformOrigin = `${ev.x}px ${ev.y}px`
        this.container.style.transform = `scale(${this.scale})`
      }
      this.resize(this.scale)
    })
    this.init()
  }

  init() {}

  add(node: Node): void {
    this.container.appendChild(node.container)
  }

  addLine(line: Line): void {
    this.container.appendChild(line.instance)
  }

  resize(scale: number) {
    this.container.style.width = this._orginSize[0] * scale + 'px'
    this.container.style.height = this._orginSize[1] * scale + 'px'
  }
}
