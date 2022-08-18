import { Object3D } from "three"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createDiv } from 'src'

export class BaseNode extends Object3D {
    container: HTMLElement
    _self: CSS2DObject
    v: Object3D
    preNode: BaseNode[]
    nextNode: BaseNode[]
    constructor() {
        super()
        this.container = createDiv()
        this.container.className = 'theme-container-base'
        this._self = new CSS2DObject(this.container)
        this.add(this._self)

    }
}