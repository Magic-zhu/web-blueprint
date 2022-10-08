import {Label} from './Label'
import {ParamPoint} from './ParamPoint'
import {createDiv} from 'src/dom/create'
import {uuid} from 'src/base/UUID'
import {WpElement} from './WpElement'

export interface ParamOptions {
  type: string
}

export class Param {
  protected uid: string = uuid()
  instance: HTMLElement
  type: string = ''
  point: ParamPoint
  label: Label
  constructor(options: ParamOptions) {
    this.type = options.type
    this.create()
  }

  create() {
    this.instance = createDiv()
    this.instance.setAttribute('class','wb-param-base')
    this.point = new ParamPoint({type:this.type})
    this.label = new Label({})
    this.add(this.point)
    this.add(this.label)
  }

  add(ele: WpElement) {
    this.instance.appendChild(ele.instance)
  }
}
