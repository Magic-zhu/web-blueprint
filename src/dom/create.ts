export const createDom = (tag: string): any => {
    return document.createElement(tag)
}

export const createDiv = (): HTMLElement => {
    return createDom('div')
}

export const createSvg = (tag: string): any => {
    return document.createElementNS("http://www.w3.org/2000/svg", tag)
}