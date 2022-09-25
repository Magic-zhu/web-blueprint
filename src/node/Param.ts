import { uuid } from "src/base/UUID"
import { WpElement } from "./WpElement"

export class Param{
    protected uid:string = uuid() 
    instance:HTMLDivElement
    children:any [] = []
    constructor() {

    }

    add(ele:WpElement) {
        this.children.push()
        this.instance.appendChild(ele.instance)
    }
}