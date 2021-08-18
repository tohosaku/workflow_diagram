import { Container, ContainerModule } from "inversify";
import {
  configureModelElement,
  loadDefaultModules,
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
  configureViewerOptions,
} from "sprotty";
import { elkLayoutModule, ElkFactory } from 'sprotty-elk';
import ELK from 'elkjs/lib/elk.bundled.js'
import { StatusNodeView, WorkflowTransitionEdgeView } from "./views";
import { StatusNode, WorkflowTransitionEdge } from "./model";
import { WorkflowDiagramModelSource } from "./model-source";

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "spacing.nodeNode": "60",
  "spacing.nodeNodeBetweenLayers": "60",
  "spacing.edgeNodeBetweenLayers": "30",
}

export function createContainer(containerId: string) {
  require("sprotty/css/sprotty.css");
  require("sprotty/css/command-palette.css");
  require("sprotty/css/edit-label.css");

  const flowModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(WorkflowDiagramModelSource).inSingletonScope();
    rebind(TYPES.IEdgeRouter).to(PolylineEdgeRouter);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraph, SGraphView);
    configureModelElement(context, "node", StatusNode, StatusNodeView, { enable: [nameFeature, withEditLabelFeature] });
    configureModelElement(context, "edge", WorkflowTransitionEdge, WorkflowTransitionEdgeView);

    // To avoid sprotty-missing. maybe bug?
    configureModelElement(context, "routing-point", SRoutingHandle, SRoutingHandleView);
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
