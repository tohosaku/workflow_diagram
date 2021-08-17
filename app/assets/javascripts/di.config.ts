import { Container, ContainerModule } from "inversify";
import {
  configureModelElement,
  loadDefaultModules,
  SEdge,
  SGraph,
  SGraphView,
  TYPES,
  ConsoleLogger,
  LogLevel,
  SRoutingHandle,
  SRoutingHandleView,
  PolylineEdgeRouter,
  nameFeature,
  withEditLabelFeature,
  editLabelFeature,
  SLabelView,
  SLabel,
  configureViewerOptions,
} from "sprotty";
import { elkLayoutModule, ElkFactory } from 'sprotty-elk';
import ELK from 'elkjs/lib/elk.bundled.js'

import { TaskView, TaskEdgeView } from "./views";
import { TaskNode } from "./model";
import { WorkflowDiagramModelSource } from "./model-source";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "spacing.nodeNode": "60",
  "spacing.nodeNodeBetweenLayers": "60",
  "spacing.edgeNodeBetweenLayers": "30",
};

export function createContainer(containerId: string) {
  require("sprotty/css/sprotty.css");
  require("sprotty/css/command-palette.css");
  require("sprotty/css/edit-label.css");

  const flowModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(WorkflowDiagramModelSource).inSingletonScope();
    rebind(TYPES.IEdgeRouter).to(PolylineEdgeRouter);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph",       SGraph,   SGraphView);
    configureModelElement(context, "node",        TaskNode, TaskView,         { enable: [nameFeature, withEditLabelFeature] });
    configureModelElement(context, "label",       SLabel,   SLabelView,       { enable: [editLabelFeature] });
    configureModelElement(context, "edge:unidir", SEdge,    TaskEdgeView);
    configureModelElement(context, "edge:bidir",  SEdge,    TaskEdgeView);

    // To avoid sprotty-missing. maybe bug?
    configureModelElement(context, "routing-point",          SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, "volatile-routing-point", SRoutingHandle, SRoutingHandleView);

    // Logging
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.log);

    configureViewerOptions(context, {
      needsClientLayout: true,
      baseDiv: containerId
    });

    bind(ElkFactory).toConstantValue(() => new ELK({
      defaultLayoutOptions: layoutOptions
    }));
  });

  const container = new Container();

  // convinient method to load default modules.
  loadDefaultModules(container);

  container.load(elkLayoutModule, flowModule);

  return container;
}
