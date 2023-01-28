import {Node} from '../Node/Node'
import {ColorPreset} from './Color'
export class NodeFactory {
  createGetNode(
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

  createBeginNode(x: number, y: number) {
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
}
