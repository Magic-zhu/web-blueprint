import {Line} from 'src'
import {Param} from 'src/node/Param'
import {uuid} from './UUID'
import {ClassType} from '../WpElement'

export interface BasePoint {
  key: string
  value: any
  type: string
}

// export enum StaticInputType {
//   string = 'string',
//   number = 'number',
//   boolean = 'boolean',
// }

// export type InputType = StaticInputType | string

export class BaseNode {
  readonly classType = ClassType.NODE
  inputPoints: Param[] = []
  outPutPoints: Param[] = []
  variables: any = {}
  // the fucntion need to execute
  func: (inputPoints: Param[], outPutPoints: Param[]) => {}

  // * base attribute
  nodeName: string = 'Function Name'
  nodeType: string = 'Function'
  _nodeLabel: string = ''
  nodeBaseWidth: number = 250
  readonly nodeId: string = uuid()
  // * base attribute
  async: boolean = false

  // the position of the node
  _x: number = 0
  _y: number = 0
  preNodeRequired:boolean = true
  nextNodeRequired:boolean = true

  // * no next point or pre point  this value should be 10;otherwise should be 0
  yAxisPak = 10

  // * LINK NODES
  preNodes: BaseNode[] = []
  nextNodes: BaseNode[] = []
  preLines: Line[] = []
  nextLines: Line[] = []

  constructor() {}

  execute() {
    this.func(this.inputPoints, this.outPutPoints)
    this.nextNodes.forEach((item) => {
      item.execute()
    })
  }

  getPrePointPosition() {
    return [this._x + 10, this._y + 32 + 10 + 5]
  }

  getNextPointPosition() {
    return [this._x + 250 - 10, this._y + 32 + 10 + 5]
  }

  getParamPosition(index: number, isInput: boolean = true) {
    if (isInput) {
      return [this._x + 10, this._y + 32 + 25 + 20 * index + this.yAxisPak]
    } else {
      return [this._x + 250, this._y + 32 + 25 + 20 * index + this.yAxisPak]
    }
  }
}
