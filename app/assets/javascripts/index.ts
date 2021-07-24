import "reflect-metadata";
import { runApp } from "./standalone";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "spacing.nodeNode": 60,
  "spacing.nodeNodeBetweenLayers": 60,
  "spacing.edgeNodeBetweenLayers": 30,
};

export function setGraph(workflow: any) {
  const graph = {
    id: "root",
    layoutOptions,
    ...workflow
  }

  runApp("sprotty", graph);
}
