import { Object3D } from "three"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createDiv } from 'src/dom/create'

export class BaseNode extends Object3D {
    container: HTMLElement
    header: HTMLElement
    body: HTMLElement
    inputPoints:[]
    outPutPoints:[]

    _self: CSS2DObject
    v: Object3D
    preNode: BaseNode[]
    nextNode: BaseNode[]
    constructor() {
        super()
        this.initContainer()
        this.initHeader()
        this.initBody()
        this.container.appendChild(this.header)
        this._self = new CSS2DObject(this.container)
        this.add(this._self)

    }

    initContainer() {
        const div = createDiv()
        div.className = 'theme-container-base'
        this.container = div
    }

    initHeader() {
        const div = createDiv()
        div.className = 'theme-container-base-header'
        this.header = div
    }

    initBody() {
        const div = createDiv()
        div.className = "theme-container-base-body"
        this.body = div
    }
}