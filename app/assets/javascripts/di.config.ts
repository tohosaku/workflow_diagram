import { Container, ContainerModule } from "inversify";
import {
  configureModelElement,
  loadDefaultModules,
  LocalModelSource,
  PolylineEdgeView,
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
import { TaskView, TaskEdgeView } from "./views";
import { TaskNode } from "./model";

export function createContainer(containerId: string) {
  require("sprotty/css/sprotty.css");
  require("sprotty/css/command-palette.css");
  require("sprotty/css/edit-label.css");

  const flowModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
    rebind(TYPES.IEdgeRouter).to(PolylineEdgeRouter);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraph,   SGraphView);
    configureModelElement(context, "node",  TaskNode, TaskView,         { enable: [nameFeature, withEditLabelFeature] });
    configureModelElement(context, "label", SLabel,   SLabelView,       { enable: [editLabelFeature] });
    configureModelElement(context, "edge",  SEdge,    TaskEdgeView);

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
  });

  const container = new Container();

  // convinient method to load default modules.
  loadDefaultModules(container);

  container.load(flowModule);
  return container;
}
