import { ElkNode } from "elkjs";

export type ENode = { id: string, width?: number, height?: number, labels: { text: string }[] }

const ns = 'http://www.w3.org/2000/svg'

export function setChildrenSizes(containerId: string, graph: { children: ENode[] }, options = { padding: 0 }) {
  const root = document.getElementById(containerId);

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('style', 'visibility:hidden');

  root?.append(svg)
  graph.children.forEach(n => setDimension(svg, n, options))
  svg.remove()
  return graph as ElkNode
}

function setDimension(svg: Element, node: ENode, options: { padding: number }) {
  const text = document.createElementNS(ns, 'text');
  text.textContent = node.labels[0].text;
  svg.append(text);

  const tb = text.getBBox();
  node.height = tb.height + options.padding
  node.width = tb.width + options.padding
}