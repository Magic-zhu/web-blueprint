import {Label} from './Label'
import {ParamPoint} from './ParamPoint'
import {Input} from './Input'
import {createDiv} from 'src/dom/create'
import {uuid} from 'src/base/UUID'
import {WpElement} from './WpElement'
import {Node} from './Node'
import {Line} from './Line'

export interface ParamOptions {
  type: string,
  name?: string,
  value?: any,
  isInput?: boolean
}

export class Param {
  protected uid: string = uuid()
  instance: HTMLElement
  type: string = ''
  point: ParamPoint
  label: Label
  input: Input
  parent: Node
  linkedLine: Line
  linkedParam: Param
  // tip:relative to the line, beign or end here
  isBeign: boolean
  // tip: input or output
  isInput: boolean
  constructor(options: ParamOptions) {
    this.type = options.type
    this.isInput = options.isInput !== undefined ? options.isInput : true
    this.create()
  }

  create() {
    this.instance = createDiv()
    this.instance.setAttribute('class', 'wb-param-base')
    this.point = new ParamPoint({type: this.type})
    this.label = new Label({})
    this.input = new Input({type: this.type})
    if (this.isInput) {
      this.add(this.point)
      this.add(this.label)
      this.add(this.input)
    } else {
      this.add(this.label)
      this.add(this.point)
    }
  }

  add(ele: WpElement) {
    this.instance.appendChild(ele.instance)
  }

  /**
   *
   * @param param
   * @param position - 起点还是终点
   */
  connect(line: Line, param: Param, position: string) {
    this.point.connect()
    this.input.hidden()
    this.linkedLine = line
    this.linkedParam = param
    if (position === 'begin') {
      this.isBeign = true
    } else {
      this.isBeign = false
    }
  }

  disConnect() {}
}
