import { Label } from "./node/Label";
import { Line } from "./node/Line";
import { Node } from "./node/Node";
import { Param } from "./node/Param";
import { ParamPoint } from "./node/ParamPoint";
import { Input } from './node/Input'

export type WpElement = Node|Line|Param|ParamPoint|Label|Input

export enum ClassType {
    LINE = 'Line',
    NODE = 'Node',
    PARAM = 'Param',
}