import "reflect-metadata";
import {
  SModelRootSchema,
  TYPES
} from "sprotty";
import { createContainer } from "./di.config";
import { WorkflowDiagramModelSource } from "./model-source";

export function setGraph(containerId: string, workflow: SModelRootSchema) {
  const container = createContainer(containerId);
  const modelSource = container.get<WorkflowDiagramModelSource>(TYPES.ModelSource);

  modelSource.sizingOptions = { padding: 8 }
  modelSource.setModel(workflow);
}