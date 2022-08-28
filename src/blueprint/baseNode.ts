import IO from "./IO"

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

export type InputType = StaticInputType| string

export class BaseNode {

    inputPoints: BasePoint[] = []
    outPutPoints: [] = []
    variables: any = {}
    // the fucntion need to execute
    func:(inputPoints: BasePoint[])=>{}

    // * base attribute
    nodeName: string = "Function Name"
    async: boolean = false

    // * LINK NODES
    preNode: BaseNode[] = []
    nextNode: BaseNode[] = []


    constructor() {
        
    }

    execute() {
        console.log(this);
        this.func(this.inputPoints)
        this.nextNode.forEach(item=>{
            item.execute()
        })
    }
}