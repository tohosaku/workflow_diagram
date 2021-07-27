import { SModelElementSchema, SGraphSchema } from "sprotty";

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

export function setChildrenSizes(
  containerId: string,
  graph: SGraphSchema,
  options = { padding: 0 }
) {
  const root = document.getElementById(containerId);

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("style", "visibility:hidden");

  root?.append(svg);
  graph.children.forEach((child) => setDimension(svg, child, options));
  svg.remove();
  return graph;
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

function isNotNullish(obj: unknown): obj is Record<string, unknown> {
  return obj !== undefined && obj !== null;
}

function isNode(child: unknown): child is SNode {
  if (!isNotNullish(child)) return false;

  const node = child as Record<string, unknown>;
  if (Array.isArray(node["children"])) {
    return true;
  }
  return false;
}

function hasText(obj: unknown): obj is { text: string } {
  if (!isNotNullish(obj)) return false;

  return typeof obj["text"] === "string";
}
