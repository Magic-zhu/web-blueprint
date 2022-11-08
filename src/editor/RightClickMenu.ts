// no instance just provide api
import {BluePrintEditor} from './main'

export interface VirtualNodeMap {
  nodeName: string
  node: Node
}
export class VirtualRightClickMenu {
  private _editor: BluePrintEditor
  nodeMap: VirtualNodeMap

  constructor(editorInstance: BluePrintEditor) {
    this._editor = editorInstance
  }
}
