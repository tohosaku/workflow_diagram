import { 
  ActionHandlerRegistry,
  SelectAction,
  SelectAllAction,
  LocalModelSource,
  SModelElementSchema,
  SModelRootSchema,
  Action
} from "sprotty";
import { isStatusNode, isWorkflowTransitionEdge } from "./model";

export class WorkflowDiagramModelSource extends LocalModelSource {

  readonly ns = 'http://www.w3.org/2000/svg'

  sizingOptions: { padding: number } = { padding: 0 }
  colormap: Record<string, string> = {}

  private element: HTMLElement | null = null;

  initialize(registry: ActionHandlerRegistry): void {
    super.initialize(registry);

    registry.register(SelectAction.KIND, this);
    registry.register(SelectAllAction.KIND, this);
  }

  setModel(newRoot: SModelRootSchema) {
    const sized = this.setChildrenSizes(newRoot)
    const colored = this.setEdgeColors(sized)
    return super.setModel(colored);
  }

  handle(action: Action): void {
    switch (action.kind) {
        case SelectAction.KIND:
            this.handleSelect(action as SelectAction);
            break;
        case SelectAllAction.KIND:
            this.handleSelectAll(action as SelectAllAction);
            break;
        default:
            super.handle(action);
    }
  }

  sourceStatusId: string | null = null

  protected handleSelect(action: SelectAction) {
    if (this.sourceStatusId ===  null) {
      this.sourceStatusId = action.selectedElementsIDs[0];
    } else {
      const targetId = action.selectedElementsIDs[0]
      const newEdge = {
        id: `e_${this.sourceStatusId}_${targetId}`,
        type: 'edge',
        sourceId: this.sourceStatusId,
        targetId: targetId
      }
      this.addElements([newEdge])
      this.sourceStatusId = null
    }
  }

  protected handleSelectAll(action: SelectAllAction) {
  }

  private setEdgeColors(graph: SModelRootSchema) {
    graph?.children?.forEach(child => {
      if (isWorkflowTransitionEdge(child) && child.color_id !== undefined) {
        child.color = this.colormap[child.color_id]
      }
    })
    return graph
  }


  private setChildrenSizes(graph: SModelRootSchema) {
    this.element = document.getElementById(this.viewerOptions.baseDiv);
    const svg = document.createElementNS(this.ns, 'svg');
    svg.setAttribute('style', 'visibility:hidden');
  
    this.element?.append(svg)
    graph?.children?.forEach(child => this.setDimension(svg, child))
    svg.remove()
    return graph
  }

  private setDimension(svg: Element, node: SModelElementSchema) {
    if (!isStatusNode(node)) return;
    const text = document.createElementNS(this.ns, 'text');
    text.classList.add('status-label');
    text.textContent = node.name;
    svg.append(text);
  
    const tb = text.getBBox();
    node.size = {
      height: tb.height + this.sizingOptions.padding,
      width: tb.width + this.sizingOptions.padding
    }
  }
}
