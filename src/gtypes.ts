import {Line} from './base/Line'
import {Param} from './base/Param'
import {Node} from './base/Node'

export enum MouseDownType {
  'LEFT' = 0,
  'RIGHT' = 2,
  'NONE' = -1,
}

export enum EditorEventType {
  'Normal' = 'normal',
  // @ 节点被按下
  'NodeActive' = 'NodeActive',
  // @ 开始连线的第一个点
  'LineBegin' = 'LineBegin',
  // @ 连线时的结束点
  'LineEnd' = 'LineEnd',
}

export interface ITransform {
  transformOrigin?: string
  translate?: number[]
}

export interface EventInfo {
  node?: Node
  pos?: number[]
  isPre?: boolean
}

export interface ClickInfo {
  pos: number[]
  isPre?: boolean
  node: Node
  param?: Param
  line?: Line
}

export interface ConnectInfo extends ClickInfo {}

export enum BeginType {
  NODE = 'node',
  PARAM = 'param',
  PROCESS = 'process',
}

export interface NodeMap {
  [key: string]: any
}

export enum ConnectPosition {
  BEGIN = 'begin',
  END = 'END',
}

export interface ParamSerialization {
  nodeId: string
  paramId: string
  beginX: number
  beginY: number
  endX: number
  endY: number
  connectType: string
  isBegin: boolean
  indexInParent: number
}

export enum LineType {
  NodeToNode = 'nodeToNode',
  ParamToNode = 'paramToNode',
  ParamToParam = 'paramToParam',
}
