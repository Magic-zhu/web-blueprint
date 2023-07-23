import { Label } from "./Label"
import { ParamPoint } from "./ParamPoint"
import { Input } from "./Input"
import { createDiv } from "../dom/create"
import { uuid } from "../base/UUID"
import { WpElement, ClassType } from "../WpElement"
import { Node } from "./Node"
import { Line } from "./Line"
import { ConnectPosition, ParamSerialization } from "../gtypes"

export interface ParamOptions {
  type: string
  name?: string
  value?: any
  isInput?: boolean
  indexInParent: number
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
  type: string = ""
  name: string = ""
  private _value: any = ""
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
  // @ 在父元素中的索引
  indexInParent: number
  isConnected: boolean = false
  // tip: when this parameter is the end point
  public linkedLine: Line
  public linkedParam: Param
  // tip: when this parameter is the begin point
  public linkedObjects: LinkedObject[] = []

  // tip:relative to the line, begin or end here
  isBegin: boolean
  // tip: input or output
  isInput: boolean

  constructor(options: ParamOptions) {
    this.type = options.type
    this.isInput = options.isInput !== undefined ? options.isInput : true
    this.name = options.name !== undefined ? options.name : "unknown"
    this.value = options.value !== undefined ? options.value : ""
    this.indexInParent = options.indexInParent
    this.create()
  }

  private create() {
    this.instance = createDiv()
    this.instance.setAttribute("class", "wb-param-base")
    this.point = new ParamPoint({ type: this.type })
    this.label = new Label({ text: this.name })
    this.input = new Input({ type: this.type })
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
  connect(line: Line, wpElement: Param | Node, position: ConnectPosition) {
    // ! only process param, the connect object could be 'Node'
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

      if (position === ConnectPosition.BEGIN) {
        this.isBegin = true
      } else {
        this.isBegin = false
      }
    }

    // * the normal condition
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

      if (position === "begin") {
        this.isBegin = true
      } else {
        this.isBegin = false
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
      this.value = ""
      this.isConnected = false
      this.input.show()
      this.point.disConnect()

      this.linkedLine.destroy()
      this.linkedParam.disConnect(this.uid)

      this.linkedParam = null
      this.linkedLine = null
    } else {
      const index = this.linkedObjects.findIndex(
        (item) => item.param.uid === paramId
      )
      if (index === -1) return
      this.linkedObjects[index].line.destroy()
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

  serialize() {
    if (this.isInput) {
      const box: ParamSerialization = {
        paramId: this.uid,
        nodeId: this.parent.nodeId,
        beginX: 0,
        beginY: 0,
        endX: 0,
        endY: 0,
        connectType: "param",
        isBegin: this.isBegin,
        indexInParent: this.indexInParent,
      }
      box.beginX = this.linkedLine.begin.x
      box.beginY = this.linkedLine.begin.y
      box.endX = this.linkedLine.end.x
      box.endY = this.linkedLine.end.y
      return JSON.stringify(box)
    } else {
      if (this.linkedObjects.length == 0) return ""
      let result = ""
      this.linkedObjects.forEach((item) => {
        const box: ParamSerialization = {
          paramId: this.uid,
          nodeId: this.parent.nodeId,
          beginX: 0,
          beginY: 0,
          endX: 0,
          endY: 0,
          connectType: "param",
          isBegin: this.isBegin,
          indexInParent: this.indexInParent,
        }
        // tip: process param may connect to node
        if (item.node) {
          box.connectType = "node"
          if (item.node.equal(item.line.beginNode)) {
            box.isBegin = true
          } else {
            box.isBegin = false
          }
        }
        box.beginX = item.line.begin.x
        box.beginY = item.line.begin.y
        box.endX = item.line.end.x
        box.endY = item.line.end.y
        result = result + JSON.stringify(box) + "#"
      })
      return result
    }
  }

  private findIndexInParent(): number {
    if (!this.parent) return
    if (this.isInput) {
      return this.parent.inputPoints.findIndex((item) => item.uid === this.uid)
    } else {
      return this.parent.outPutPoints.findIndex((item) => item.uid === this.uid)
    }
  }
}
