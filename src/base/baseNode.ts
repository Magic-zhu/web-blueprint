import {Line} from 'src'
import { Param } from 'src/node/Param'
import {uuid} from './UUID'

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
  inputPoints: Param[] = []
  outPutPoints: Param[] = []
  variables: any = {}
  // the fucntion need to execute
  func: (inputPoints: Param[]) => {}

  // * base attribute
  nodeName: string = 'Function Name'
  nodeType: string = 'Function'
  readonly nodeId: string = uuid()
  // * base attribute
  async: boolean = false
  _x: number = 0
  _y: number = 0

  // * LINK NODES
  preNodes: BaseNode[] = []
  nextNodes: BaseNode[] = []
  preLines: Line[] = []
  nextLines: Line[] = []

  constructor() {}

  execute() {
    this.func(this.inputPoints)
    this.nextNodes.forEach((item) => {
      item.execute()
    })
  }

  getPrePointPosition() {
    return [this._x + 10, this._y + 32 + 10 + 5]
  }

  getNextPointPosition() {
    return [this._x + 200 - 10, this._y + 32 + 10 + 5]
  }
}
