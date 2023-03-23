import {InputParam, Node, OutputParam} from './Node'
import {ColorPreset} from './Color'
export class NodeFactory {
  // *********************
  // **  process node   **
  // *********************

  private GetNode(
    x: number,
    y: number,
    nodeLabel: string,
    type: string,
    value: any,
  ) {
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

  plusNumber(x: number, y: number) {
    return new Node({
      x,
      y,
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

  GetString(x: number, y: number, nodeLabel: string, value: string) {
    const node = this.GetNode(x, y, nodeLabel, 'string', value)
    node.nodeName = 'GetString'
    return node
  }

  GetNumber(x: number, y: number, nodeLabel: string, value: number) {
    const node = this.GetNode(x, y, nodeLabel, 'number', value)
    node.nodeName = 'GetNumber'
    return node
  }

  GetBoolean(x: number, y: number, nodeLabel: string, value: boolean) {
    const node = this.GetNode(x, y, nodeLabel, 'boolean', value)
    node.nodeName = 'GetBoolean'
    return node
  }

  GetObject(x: number, y: number, nodeLabel: string, value: any) {
    const node = this.GetNode(x, y, nodeLabel, 'object', value)
    node.nodeName = 'GetObject'
    return node
  }

  BranchNode(x: number, y: number) {
    return new Node({
      x: x,
      y: y,
      nodeName: 'Branch',
      nextNodeRequired: false,
      color: 'linear-gradient(135deg,#f54ea2,rgba(0,0,0,0.5))',
      input: [
        {
          type: 'boolean',
          value: false,
          name: 'condition',
        },
      ],
      output: [
        {
          type: 'process',
          name: 'true',
        },
        {
          type: 'process',
          name: 'false',
        },
      ],
      func: (inputs, outputs) => {
        if (inputs[0].value) {
          outputs[0].linkedObjects[0].node.execute()
        } else {
          outputs[1].linkedObjects[0].node.execute()
        }
      },
    })
  }

  ForNode(x: number, y: number) {
    return new Node({
      x,
      y,
      nodeName: 'ForEach',
      nextNodeRequired: false,
      color: 'linear-gradient(135deg,#f54ea2,rgba(0,0,0,0.5))',
      input: [
        {
          type: 'object',
          value: false,
          name: 'input',
        },
      ],
      output: [
        {
          type: 'process',
          name: 'loop',
        },
        {
          type: 'object',
          name: 'element',
        },
        {
          type: 'number',
          name: 'index',
        },
        {
          type: 'process',
          name: 'complete',
        },
      ],
      func: (inputs, outputs) => {
        const arr = inputs[0].value
        const nextNode = outputs[0].linkedObjects[0].node
        if (arr instanceof Array) {
          for (let i = 0; i < arr.length; i++) {
            outputs[1].value = arr[i]
            outputs[2].value = i
            nextNode.execute()
          }
          if (outputs[3].linkedObjects[0]) {
            outputs[3].linkedObjects[0].node.execute()
          }
        }
      },
    })
  }

  PrintLog(x: number, y: number) {
    return new Node({
      nodeName: 'PrintLog',
      color: ColorPreset.GreenGradient,
      x,
      y,
      input: [
        {
          type: 'any',
          value: 0,
          name: 'value',
        },
      ],
      func: (inputs) => {
        console.log(inputs[0].value)
      },
    })
  }
}

export const NodeFactoryInstance = new NodeFactory()

export const FactoryMap = {
  GetString: NodeFactoryInstance.GetString(0, 0, '', ''),
  GetNumber: NodeFactoryInstance.GetNumber(0, 0, '', 0),
  GetBoolean: NodeFactoryInstance.GetBoolean(0, 0, '', false),
  GetObject: NodeFactoryInstance.GetObject(0, 0, '', null),
  Begin: NodeFactoryInstance.BeginNode(0, 0),
  Plus: NodeFactoryInstance.plusNumber(0, 0),
  Minus: NodeFactoryInstance.minusNumber(),
  Branch: NodeFactoryInstance.BranchNode(0, 0),
  ForEach: NodeFactoryInstance.ForNode(0, 0),
  PrintLog: NodeFactoryInstance.PrintLog(0, 0),
}
