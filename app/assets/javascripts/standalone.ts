import {
  LocalModelSource,
  TYPES,
} from "sprotty";
import { createContainer } from "./di.config";
import { ElkGraphJsonToSprotty } from "./elkgraph-to-sprotty";
import ELK from 'elkjs/lib/elk.bundled.js'
import { setChildrenSizes, ENode } from "./calculate-size";

export async function runApp(containerId: string, graph: { children: ENode[] }) {

  const transformer = new ElkGraphJsonToSprotty();
  const elk = new ELK()
  const sized = setChildrenSizes(containerId, graph, { padding: 8 })
  const elkgraph = await elk.layout(sized)
  const container = createContainer(containerId);
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

  modelSource.setModel(transformer.transform(elkgraph));
}
