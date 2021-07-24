/** @jsx svg */
import { svg } from 'snabbdom-jsx';
import { injectable } from 'inversify';
import { Point, PolylineEdgeView, RectangularNodeView, RenderingContext, SEdge, toDegrees, angleOfPoint } from "sprotty";
import { TaskNode } from "./model";
import { VNode } from "snabbdom/vnode";

@injectable()
export class TaskView extends RectangularNodeView {
    render(node: Readonly<TaskNode>, context: RenderingContext): VNode {
        return <g>
            <rect class-sprotty-node={true} class-task={true}
                class-mouseover={node.hoverFeedback} class-selected={node.selected}
                x="0" y="0"  rx={5} ry={5} width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
            {context.renderChildren(node)}
        </g>;
    }
}
@injectable()
export class TaskEdgeView extends PolylineEdgeView {
    protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
        const firstPoint = segments[0];
        let path = `M ${firstPoint.x},${firstPoint.y}`;
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i];
            path += ` L ${p.x},${p.y}`;
        }
        return <path class-elkedge={true} d={path}/>;
    }

    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        return [
            <path class-elkedge={true} class-arrow={true} d="M 0,0 L 8,-3 L 8,3 Z"
                  transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ];
    }
}