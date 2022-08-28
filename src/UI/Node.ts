import { BaseNode } from "src/blueprint/BaseNode"
import { createDiv, createSvg } from 'src/dom/create'

export interface NodeParams {
    nodeName: string
    headerClass?: string
    color?: string
}

export class Node extends BaseNode {
    // * The ui part
    container: HTMLElement
    header: HTMLElement
    body: HTMLElement
    leftBody: HTMLElement
    rightBody: HTMLElement
    prePoint: SVGElement
    nextPoint: SVGElement
    headerClass: string = "theme-container-base-header"
    color: string

    // * status attribte
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
    }

    initContainer() {
        const div = createDiv()
        div.className = 'theme-container-base'
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
        polygon.setAttribute("fill", "none")
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
        polygon.setAttribute("fill", "none")
        svg.appendChild(polygon)
        this.nextPoint = svg
    }

    initInput( type: InputType) {
        const svg: SVGElement = createSvg("svg")
    }

    addInput() {

    }
}