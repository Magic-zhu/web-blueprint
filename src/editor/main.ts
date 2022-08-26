import { BaseNode } from "src/blueprint/baseNode"
import IO from "src/blueprint/IO"
export class BluePrintEditor {
    container: HTMLElement
    scale:number = 1
    constructor(container) {
        this.container = container
        container.style.position = 'relative'
        container.style.transform = 'scale(1)'
        this.container.addEventListener('mouseup',(ev)=>{
            IO.emit('mouseup', ev)
        })
        this.container.addEventListener('mousemove',(ev)=>{
            IO.emit('mousemove', ev)
        })
        this.container.addEventListener('mousewheel',(ev:any)=>{
            const scale  = this.container.style.transform
            // container.style.transformOrigin = ''           
            if(ev.deltaY < 0){
                this.scale+=0.1
                this.container.style.transform = `scale(${this.scale})`
            }else{
                this.scale-=0.1
                this.container.style.transform = `scale(${this.scale})`
            }
        })
        this.init()
    }

    init() {

    }

    add(node: BaseNode): void {
        this.container.appendChild(node.container)
    }
}