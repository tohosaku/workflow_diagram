import { injectable, inject } from 'inversify';
import {
    LocalModelSource,
    SModelRootSchema,
    SGraphSchema,
    SModelElementSchema,
    Dimension,
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
  if (!hasName(node)) return;

  const text = document.createElementNS(ns, "text");
  text.textContent = node.name;
  svg.append(text);
  const tb = text.getBBox();
  node.size = {
    height: tb.height + options.padding,
    width: tb.width + options.padding,
  };
}


function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj !== 'object' && obj !== null;
}

function hasName(obj: unknown): obj is { name: string, size?: Dimension } {
  if (!isObject(obj)) return false;

  return typeof obj["name"] === "string";
}
