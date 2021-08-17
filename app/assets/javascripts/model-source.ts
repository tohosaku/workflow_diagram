import { injectable, inject } from 'inversify';
import {
    LocalModelSource,
    SModelRootSchema,
    SGraphSchema,
    SModelElementSchema,
} from "sprotty";
import { ElkLayoutEngine } from 'sprotty-elk';

@injectable()
export class WorkflowDiagramModelSource extends LocalModelSource {

    constructor(@inject(ElkLayoutEngine) private elkEngine: ElkLayoutEngine) {
        super();
    }

    async setModel(graph: SModelRootSchema) {
        const sized = setChildrenSizes(this.viewerOptions.baseDiv, graph, { padding: 8 })
        const result = await this.elkEngine.layout(sized);
        super.setModel(result);
    }
}

const ns = "http://www.w3.org/2000/svg";

type SNode = {
  id: string;
  type: string;
  children?: SModelElementSchema[];
  size?: {
    width: number;
    height: number;
  };
};

function setChildrenSizes(
  containerId: string,
  graph: SModelRootSchema,
  options = { padding: 0 }
): SGraphSchema {
  const root = document.getElementById(containerId);

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("style", "visibility:hidden");

  root?.append(svg);
  graph.children?.forEach((child) => setDimension(svg, child, options));
  svg.remove();
  return graph as SGraphSchema;
}

function setDimension(
  svg: Element,
  node: SModelElementSchema,
  options: { padding: number }
) {
  if (isNode(node)) {
    const text = document.createElementNS(ns, "text");
    const children = node.children;
    if (children === undefined) return;
    const child = children[0];
    if (hasText(child)) {
      text.textContent = child.text;
      svg.append(text);

      const tb = text.getBBox();
      (node as SNode).size = {
        height: tb.height + options.padding,
        width: tb.width + options.padding,
      };
    }
  }
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj !== 'object' && obj !== null;
}

function isNode(child: unknown): child is SNode {
  if (!isObject(child)) return false;

  const node = child as Record<string, unknown>;
  if (Array.isArray(node["children"])) {
    return true;
  }
  return false;
}

function hasText(obj: unknown): obj is { text: string } {
  if (!isObject(obj)) return false;

  return typeof obj["text"] === "string";
}
