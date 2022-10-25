import {createSvg} from 'src/dom/create'

export class Selector {
  private instance: SVGElement
  private inside: SVGElement
  isHidden: boolean = true
  width: number
  height: number
  x: number
  y: number
  constructor() {
    this.create()
  }

  private create() {
    const container = createSvg('svg')
    container.style.position = 'absolute'
    container.style.opacity = '0.5'
    const rec = createSvg('rect')
    rec.setAttribute('width', '0')
    rec.setAttribute('height', '0')
    rec.setAttribute('stroke', '#5352ed')
    rec.setAttribute('stroke-width', '4px')
    rec.setAttribute('fill', '#70a1ff')
    this.inside = rec
    container.appendChild(rec)
    this.instance = container
    document.body.appendChild(container)
  }

  update(x: number, y: number, width: number, height: number): void {
    if (width >= 0 && height >= 0) {
      this.instance.style.left = x + 'px'
      this.instance.style.top = y + 'px'
      this.x = x
      this.y = y
    }

    if (width < 0 && height < 0) {
      this.instance.style.left = x + width + 'px'
      this.instance.style.top = y + height + 'px'
      this.x = x + width
      this.y = y + height
    }

    if (width > 0 && height < 0) {
      this.instance.style.left = x + 'px'
      this.instance.style.top = y + height + 'px'
      this.x = x
      this.y = y + height
    }

    if (width < 0 && height > 0) {
      this.instance.style.left = x + width + 'px'
      this.instance.style.top = y + 'px'
      this.x = x + width
      this.y = y
    }

    this.instance.style.width = Math.abs(width) + 'px'
    this.instance.style.height = Math.abs(height) + 'px'
    this.width = Math.abs(width)
    this.height = Math.abs(height)
    this.inside.setAttribute('width', `${Math.abs(width)}`)
    this.inside.setAttribute('height', `${Math.abs(height)}`)
  }

  show() {
    this.instance.style.display = 'block'
    this.isHidden = false
  }

  hidden() {
    this.update(0, 0, 0, 0)
    this.instance.style.display = 'none'
    this.isHidden = true
  }
}
