import { Label } from "./base/Label";
import { Line } from "./base/Line";
import { Node } from "./base/Node";
import { Param } from "./base/Param";
import { ParamPoint } from "./base/ParamPoint";
import { Input } from './base/Input'

export type WpElement = Node|Line|Param|ParamPoint|Label|Input

export enum ClassType {
    LINE = 'Line',
    NODE = 'Node',
    PARAM = 'Param',
}