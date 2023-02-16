import {InputParam, Node, OutputParam} from '../Node/Node'
import {ColorPreset} from './Color'
export class NodeFactory {
  GetNode(x: number, y: number, nodeLabel: string, type: string, value: any) {
    return new Node({
      x,
      y,
      nodeName: 'Get',
      nodeLabel,
      preNodeRequired: false,
      nextNodeRequired: false,
      color: ColorPreset.PurpleGradient,
      output: [
        {
          name: 'out',
          type,
          value,
        },
      ],
      func: () => {},
    })
  }

  BeginNode(x: number, y: number) {
    return new Node({
      x,
      y,
      nodeName: 'Begin',
      nodeLabel: '',
      preNodeRequired: false,
      nextNodeRequired: true,
      color: ColorPreset.BrownGradient,
      func: () => {},
    })
  }

  plusNumber() {
    return new Node({
      x: 0,
      y: 0,
      nodeName: 'Plus',
      color: ColorPreset.BlueGradient,
      input: [
        {
          type: 'number',
          name: 'in1',
          value: 0,
        },
        {
          type: 'number',
          name: 'in2',
          value: 0,
        },
      ],
      output: [
        {
          type: 'number',
          name: 'out',
        },
      ],
      func: (inputs: InputParam[], outputs: OutputParam[]) => {
        outputs[0].value = Number(inputs[0].value) + Number(inputs[1].value)
      },
    })
  }

  minusNumber() {
    return new Node({
      x: 0,
      y: 0,
      nodeName: 'Minus',
      color: ColorPreset.BlueGradient,
      input: [
        {
          type: 'number',
          name: 'in1',
          value: 0,
        },
        {
          type: 'number',
          name: 'in2',
          value: 0,
        },
      ],
      output: [
        {
          type: 'number',
          name: 'out',
        },
      ],
      func: (inputs: InputParam[], outputs: OutputParam[]) => {
        outputs[0].value = Number(inputs[0].value) - Number(inputs[1].value)
      },
    })
  }

  multiNumber() {
    return new Node({
      x: 0,
      y: 0,
      nodeName: 'Multi',
      color: ColorPreset.BlueGradient,
      input: [
        {
          type: 'number',
          name: 'in1',
          value: 0,
        },
        {
          type: 'number',
          name: 'in2',
          value: 0,
        },
      ],
      output: [
        {
          type: 'number',
          name: 'out',
        },
      ],
      func: (inputs: InputParam[], outputs: OutputParam[]) => {
        outputs[0].value = Number(inputs[0].value) * Number(inputs[1].value)
      },
    })
  }

  diviNumber() {
    return new Node({
      x: 0,
      y: 0,
      nodeName: 'Division',
      color: ColorPreset.BlueGradient,
      input: [
        {
          type: 'number',
          name: 'in1',
          value: 0,
        },
        {
          type: 'number',
          name: 'in2',
          value: 0,
        },
      ],
      output: [
        {
          type: 'number',
          name: 'out',
        },
      ],
      func: (inputs: InputParam[], outputs: OutputParam[]) => {
        outputs[0].value = Number(inputs[0].value) / Number(inputs[1].value)
      },
    })
  }
}
