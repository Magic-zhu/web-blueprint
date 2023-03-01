import {Label} from './Label'
import {ParamPoint} from './ParamPoint'
import {Input} from './Input'
import {createDiv} from 'src/dom/create'
import {uuid} from 'src/base/UUID'
import {WpElement, ClassType} from '../WpElement'
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
  param?: Param
  id: string
  node?: Node
  classType: ClassType
}

export class Param {
  readonly classType = ClassType.PARAM
  readonly uid: string = uuid()
  instance: HTMLElement
  type: string = ''
  name: string = ''
  private _value: any = ''
  public get value(): any {
    if (this.isConnected && this.isInput) {
      return this.linkedParam.value
    }
    return this._value
  }
  public set value(value: any) {
    this._value = value
  }
  point: ParamPoint
  label: Label
  input: Input
  parent: Node
  isConnected: boolean = false
  // tip: when this parameter is the end point
  public linkedLine: Line
  public linkedParam: Param
  // tip: when this parameter is the begin point
  public linkedObjects: LinkedObject[] = []

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
   * @param position - begin or end
   */
  connect(line: Line, wpElement: Param | Node, position: string) {
    // # only process param, the connect object could be 'Node'
    if (wpElement.classType === ClassType.NODE) {
      const node = wpElement as Node
      this.point.connect()
      this.isConnected = true

      this.linkedObjects.push({
        line,
        node,
        id: node.nodeId,
        classType: ClassType.NODE,
      })

      if (position === 'begin') {
        this.isBeign = true
      } else {
        this.isBeign = false
      }
    }

    // # the normal condition
    if (wpElement.classType === ClassType.PARAM) {
      const param = wpElement as Param
      if (this.isInput && this.isConnected) return
      this.point.connect()
      this.isConnected = true
      this.input.hidden()

      /**
       * tip: the output point can connect to serval points,
       * tip: but the input point can only connect to one point
       */
      if (!this.isInput) {
        this.linkedObjects.push({
          line,
          param,
          id: param.uid,
          classType: ClassType.PARAM,
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
  }

  // tip step1 若为输入->清空value,展示输入框
  // tip step2 相关节点断开
  // tip step3 清空当前节点连线
  /**
   *
   * @param paramId - the param should be removed from linkedObjects
   * @ this function should be called by the input param firstly
   */
  disConnect(paramId?: string) {
    if (this.isInput) {
      this.value = ''
      this.isConnected = false
      this.input.show()
      this.point.disConnect()

      this.linkedLine.destory()
      this.linkedParam.disConnect(this.uid)

      this.linkedParam = null
      this.linkedLine = null
    } else {
      const index = this.linkedObjects.findIndex(
        (item) => item.param.uid === paramId,
      )
      if (index === -1) return
      this.linkedObjects[index].line.destory()
      this.linkedObjects.splice(index, 1)
      if (this.linkedObjects.length === 0) {
        this.isConnected = false
        this.point.disConnect()
      }
    }
  }

  update(value: any) {
    this.value = value
  }
}
