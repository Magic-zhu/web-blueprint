import IO from './IO'
import {v4 as uuidv4} from 'uuid'

export interface BasePoint {
  key: string
  value: any
  type: string
}

export enum StaticInputType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
}

export type InputType = StaticInputType | string

export class BaseNode {
  inputPoints: BasePoint[] = []
  outPutPoints: BasePoint[] = []
  variables: any = {}
  // the fucntion need to execute
  func: (inputPoints: BasePoint[]) => {}

  // * base attribute
  nodeName: string = 'Function Name'
  nodeType: string = 'Function'
  readonly nodeId: string = uuidv4()
  // * base attribute
  async: boolean = false
  _x: number = 0
  _y: number = 0

  // * LINK NODES
  preNode: BaseNode[] = []
  nextNode: BaseNode[] = []

  constructor() {}

  execute() {
    this.func(this.inputPoints)
    this.nextNode.forEach((item) => {
      item.execute()
    })
  }
}
