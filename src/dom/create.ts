export const createDom = (tag: string) => {
    return document.createElement(tag)
}

export const createDiv = (): HTMLElement => {
    return createDom('div')
}