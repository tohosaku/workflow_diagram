import {
    SModelElementSchema,
    SNode,
    SNodeSchema
} from "sprotty";

export interface StatusNodeSchema extends SNodeSchema {
    name: string
    size?: { height: number, width: number }
}

export class StatusNode extends SNode {
    name: string = ''
    layout: string = 'hbox'
}

function isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && obj !== null
}

export function isStatusNode(child: unknown): child is SModelElementSchema & StatusNodeSchema {
    if (!isObject(child)) return false;

    const node = child as Record<string, unknown>
    if (typeof node['name'] === 'string') {
        return true;
    }
    return false;
}
