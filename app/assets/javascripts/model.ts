import { SNode, SNodeSchema } from "sprotty";

export interface TaskNodeSchema extends SNodeSchema {
    name?: string
}

export class TaskNode extends SNode {
    name: string = ''
    layout: string = 'hbox'
}
