import {Label} from './Label'
import {ParamPoint} from './ParamPoint'
import {Input} from './Input'
import {createDiv} from 'src/dom/create'
import {uuid} from 'src/base/UUID'
import {WpElement} from './WpElement'
import {Node} from './Node'
import {Line} from './Line'

export interface ParamOptions {
  type: string
  name?: string
  value?: any
  isInput?: boolean
}

export interface LinkedObject {
  line: Line
  param: Param
  id: string
}

export class Param {
  protected uid: string = uuid()
  instance: HTMLElement
  type: string = ''
  name: string = ''
  value: any = ''
  point: ParamPoint
  label: Label
  input: Input
  parent: Node
  // tip# when this parameter is the end point
  public linkedLine: Line
  private linkedParam: Param
  // tip# when this parameter is the begin point
  public linkedObjects: LinkedObject[]

  // tip:relative to the line, beign or end here
  isBeign: boolean
  // tip: input or output
  isInput: boolean
  constructor(options: ParamOptions) {
    this.type = options.type
    this.isInput = options.isInput !== undefined ? options.isInput : true
    this.name = options.name !== undefined ? options.name : 'unknown'
    this.value = options.value !== undefined ? options.value : ''
    this.create()
  }

  private create() {
    this.instance = createDiv()
    this.instance.setAttribute('class', 'wb-param-base')
    this.point = new ParamPoint({type: this.type})
    this.label = new Label({text: this.name})
    this.input = new Input({type: this.type})
    // tip: set parent
    this.input.parent = this
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

    /**
     * tip# the output point can connect to serval points,
     * tip# but the input point can only connect to one point
     */
    if (!this.input) {
      this.linkedObjects.push({
        line,
        param,
        id: param.uid,
      })
    } else {
      this.linkedLine = line
      this.linkedParam = param
    }

    if (position === 'begin') {
      this.isBeign = true
    } else {
      this.isBeign = false
    }

    // pass the value
    if (this.isInput) {
      this.update(param.value)
    }
  }

  disConnect() {}

  update(value: any) {
    this.value = value
  }
}
