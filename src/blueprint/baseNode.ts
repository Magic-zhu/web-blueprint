import { Object3D } from "three"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createDiv, createSvg } from 'src/dom/create'
import IO from "./IO"

export interface NodeParams {
    nodeName: string
    headerClass?: string
    color?: string
}

export class BaseNode extends Object3D {
    container: HTMLElement
    header: HTMLElement
    body: HTMLElement
    leftBody: HTMLElement
    rightBody: HTMLElement
    prePoint: SVGElement
    nextPoint: SVGElement
    inputPoints: []
    outPutPoints: []

    _self: CSS2DObject
    v: Object3D
    preNode: BaseNode[]
    nextNode: BaseNode[]

    headerClass: string = "theme-container-base-header"
    nodeName: string = "函数名称"
    color: string

    selected: boolean

    // if onmousedown?
    active: boolean = false

    constructor(params: NodeParams) {
        super()
        this.nodeName = params.nodeName
        if (params.headerClass) {
            this.headerClass = params.headerClass
        }
        if (params.color) {
            this.color = params.color
        }
        this.initContainer()
        this.initHeader()
        this.initBody()
        this.initPrePoint()
        this.initNextPoint()
        this.container.appendChild(this.header)
        this.container.appendChild(this.body)
        this.leftBody.appendChild(this.prePoint)
        this.rightBody.appendChild(this.nextPoint)
        this._self = new CSS2DObject(this.container)
        this.add(this._self)
    }

    initContainer() {
        const div = createDiv()
        div.className = 'theme-container-base'
        div.addEventListener('click', () => {
            this.onClick()
        })
        div.addEventListener('mousedown', () => {
            this.active = true
        })
        IO.on('mousemove', (ev: MouseEvent) => {
            if (this.active) {
                console.log(ev);
            }
        })
        IO.on('mouseup', () => {
            if (this.active) {
                this.active = false
            }
        })
        this.container = div
    }

    initHeader() {
        const div = createDiv()
        div.className = this.headerClass
        div.innerText = this.nodeName
        if (this.color) {
            div.style.backgroundColor = this.color
        }
        this.header = div
    }

    initBody() {
        const div = createDiv()
        div.className = "theme-container-base-body"
        const left = createDiv()
        left.className = "theme-container-base-body-left"
        const right = createDiv()
        right.className = "theme-container-base-body-right"
        div.appendChild(left)
        div.appendChild(right)
        this.leftBody = left
        this.rightBody = right
        this.body = div
    }

    initPrePoint() {
        const svg: SVGElement = createSvg("svg")
        svg.setAttribute('class', 'prePoint')
        const polygon: SVGPolygonElement = createSvg("polygon")
        polygon.setAttribute("points", "0,0 0,10 5,10 9,5 5,0")
        polygon.setAttribute("stroke-width", "2px")
        polygon.setAttribute("stroke", "white")
        svg.appendChild(polygon)
        this.prePoint = svg
    }

    initNextPoint() {
        const svg: SVGElement = createSvg("svg")
        svg.setAttribute('class', 'nextPoint')
        const polygon: SVGPolygonElement = createSvg("polygon")
        polygon.setAttribute("points", "0,0 0,10 5,10 9,5 5,0")
        polygon.setAttribute("stroke-width", "2px")
        polygon.setAttribute("stroke", "white")
        svg.appendChild(polygon)
        this.nextPoint = svg
    }


    onClick() {
        this.selected = true
    }

    onMouseMove() {

    }
}