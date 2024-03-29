import {
  createDiv,
  createInputNumberBox,
  createInputTextBox,
  createCheckBox,
} from "../dom/create"
import { Param } from "./Param"
export interface InputOptions {
  type: string
}
export class Input {
  instance: HTMLElement
  private inputIntance: HTMLElement
  type: string
  parent: Param
  _value: any
  constructor(options: InputOptions) {
    this.type = options.type
    this.create()
  }

  create() {
    const box = createDiv()
    box.setAttribute("class", "wb-input-box")
    let inputBox: HTMLElement
    switch (this.type) {
      case "number":
        inputBox = createInputNumberBox()
        inputBox.setAttribute("class", "wb-input-number")
        break
      case "string":
        inputBox = createInputTextBox()
        inputBox.setAttribute("class", "wb-input-string")
        break
      case "boolean":
        inputBox = createCheckBox()
        inputBox.setAttribute("class", "wb-input-checkbox")
        break
      default:
        inputBox = createDiv()
    }
    inputBox.oninput = this.inputChangeHanlde.bind(this)
    box.appendChild(inputBox)
    this.inputIntance = inputBox
    this.instance = box
  }

  inputChangeHanlde(v: any) {
    this.value = (this.inputIntance as any).value
    this.parent.update(this.value)
  }

  get value() {
    return this._value
  }

  set value(s: any) {
    this._value = s
  }

  hidden() {
    this.instance.style.display = "none"
  }

  show() {
    this.instance.style.display = ""
  }
}
