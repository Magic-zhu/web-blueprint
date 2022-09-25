import { createSpan } from "src/dom/create"

export interface LabelOptions {
    text?:string
}

export class Label {
    private _text:string = ''
    instance: HTMLSpanElement

    constructor(options:LabelOptions){
        this.instance = createSpan()
        if(options.text){
            this.text = options.text
        }
    }

    get text(){
        return this._text
    }

    set text(value:string){
        this._text = value
        this.instance.innerText = value
    }
}