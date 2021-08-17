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
            <rect class-sprotty-node={true} class-workflow-status={true}
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
        const s1 = segments[1];
        const s2 = segments[0];
        const t1 = segments[segments.length - 2];
        const t2 = segments[segments.length - 1];

        const sourceArrow = <path class-elkedge={true} class-arrow={true} d="M 0,0 L 8,-3 L 8,3 Z"
            transform={`rotate(${toDegrees(angleOfPoint({ x: s1.x - s2.x, y: s1.y - s2.y }))} ${s2.x} ${s2.y}) translate(${s2.x} ${s2.y})`}/>
        const targetArrow = <path class-elkedge={true} class-arrow={true} d="M 0,0 L 8,-3 L 8,3 Z"
            transform={`rotate(${toDegrees(angleOfPoint({ x: t1.x - t2.x, y: t1.y - t2.y }))} ${t2.x} ${t2.y}) translate(${t2.x} ${t2.y})`}/>
        
        if (edge.type === 'edge:unidir') {
            return [ targetArrow ];
        }
        else {
            return [ sourceArrow, targetArrow ];
        }
    }
}