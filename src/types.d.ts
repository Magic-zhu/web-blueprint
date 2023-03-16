import {Line} from './node/Line'
import {Param} from './node/Param'
import {Node} from './node/Node'

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
