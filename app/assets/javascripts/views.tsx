/** @jsx svg */
import { svg } from 'snabbdom-jsx';
import { injectable } from 'inversify';
import { Point, PolylineEdgeView, RectangularNodeView, RenderingContext, toDegrees, angleOfPoint } from "sprotty";
import { StatusNode, WorkflowTransitionEdge } from "./model";
import { VNode } from "snabbdom/vnode";

@injectable()
export class StatusNodeView extends RectangularNodeView {
    render(node: Readonly<StatusNode>, context: RenderingContext): VNode {
        const width  = Math.max(node.size.width, 0)
        const height = Math.max(node.size.height, 0)
        const props = {
          'class-sprotty-node': true,
          'class-workflow-status': true,
          'class-mouseover': node.hoverFeedback,
          'class-selected': node.selected,
           x: 0,
           y: 0,
           rx: 5,
           ry: 5,
           width: width,
           height: height
        }
        return <g>
            <rect {...props}></rect>
            <text class-status-label={true} x={width / 2} y={height / 2}>{node.name}</text>
            {context.renderChildren(node)}
        </g>;
    }
}

@injectable()
export class WorkflowTransitionEdgeView extends PolylineEdgeView {
    protected renderLine(edge: WorkflowTransitionEdge, segments: Point[], context: RenderingContext): VNode {
        const firstPoint = segments[0];
        let path = `M ${firstPoint.x},${firstPoint.y}`;
        for (let i = 1; i < segments.length; i++) {
            const p = segments[i];
            path += ` L ${p.x},${p.y}`;
        }
        return <path class-workflow-transition={true} d={path} stroke={edge.color}/>;
    }

    protected renderAdditionals(edge: WorkflowTransitionEdge, segments: Point[], context: RenderingContext): VNode[] {
        const s1 = segments[1];
        const s2 = segments[0];
        const t1 = segments[segments.length - 2];
        const t2 = segments[segments.length - 1];

        const sourceArrow = this.arrowHead(s1, s2, edge.color)
        const targetArrow = this.arrowHead(t1, t2, edge.color)

        if (edge.direction === 'unidir') {
            return [ targetArrow ];
        }
        else {
            return [ sourceArrow, targetArrow ];
        }
    }

    private arrowHead(p1: Point, p2: Point, color?: string) {
        return <path fill={color} d="M 0,0 L 8,-3 L 8,3 Z"
            transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
    }
}
