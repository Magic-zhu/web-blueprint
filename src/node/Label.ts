import {createSpan} from 'src/dom/create'

export interface LabelOptions {
  text?: string
}

export class Label {
  private _text: string = ''
  instance: HTMLSpanElement

  constructor(options: LabelOptions) {
    this.instance = createSpan()
    this.instance.setAttribute('class','wb-param-label')
    if (options.text) {
      this.text = options.text
    } else {
      this.text = '未命名'
    }
  }

  get text() {
    return this._text
  }

  set text(value: string) {
    this._text = value
    this.instance.innerText = value
  }
}
