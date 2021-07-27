import {
  LocalModelSource,
  TYPES,
  SGraphSchema
} from "sprotty";
import { createContainer } from "./di.config";
import ELK, { LayoutOptions } from 'elkjs/lib/elk.bundled.js'
import { setChildrenSizes } from "./calculate-size";

import { elkLayoutModule, ElkFactory, ElkLayoutEngine } from 'sprotty-elk';

export async function runApp(containerId: string, graph: SGraphSchema, layoutOptions: LayoutOptions) {
 
  const sized = setChildrenSizes(containerId, graph, { padding: 8 })
  const container = createContainer(containerId);
  container.load(elkLayoutModule);
  container.bind(ElkFactory).toConstantValue(() => new ELK({
    defaultLayoutOptions: layoutOptions
  }));
  const elkEngine = container.get(ElkLayoutEngine);
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
  const result = await elkEngine.layout(sized);
 
  modelSource.setModel(result);
}