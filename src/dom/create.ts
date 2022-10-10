export const createDom = (tag: string): any => {
  return document.createElement(tag)
}

export const createDiv = (): HTMLElement => {
  return createDom('div')
}

export const createSvg = (tag: string): any => {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

export const createInputNumberBox = (): HTMLInputElement => {
  const input = document.createElement('input')
  input.setAttribute('type', 'number')
  return input
}

export const createInputTextBox = (): HTMLInputElement => {
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  return input
}


export const createSpan = ():HTMLSpanElement => {
  return createDom('span')
}

export const createCheckBox = ():HTMLInputElement => {
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    return input
}