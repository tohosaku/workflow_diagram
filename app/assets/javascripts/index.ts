import "reflect-metadata";
import { runApp } from "./standalone";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "spacing.nodeNode": "60",
  "spacing.nodeNodeBetweenLayers": "60",
  "spacing.edgeNodeBetweenLayers": "30",
};

export function setGraph(workflow: any) {
  runApp("sprotty", workflow, layoutOptions);
}


