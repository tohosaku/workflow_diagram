# frozen_string_literal: true

class WorkflowDiagramsController < ApplicationController
  # layout 'admin'
  # before_action :require_admin
  helper :workflows

  def show
    respond_to do |format|
      format.html
      format.json { render json: graph(params[:tracker_id], params[:role_id]) }
    end
  end

  private

  def graph(tracker_id, role_id)
    nodes = graph_children.map do |c|
      {
        type: 'node',
        id: "n#{c.id}",
        name: c.name
      }
    end
    edges = graph_edges(tracker_id, role_id).map do |e|
      {
        type: "edge",
        id: "e#{e.id}",
        sourceId: "n#{e.old_status_id}",
        targetId: "n#{e.new_status_id}",
        direction: e.attributes['direction']
      }
    end
    {
      type: 'graph',
      id: 'root',
      children: nodes + edges
    }
  end

  def graph_children
    IssueStatus.all
  end

  SQL = <<~EOSQL
    SELECT
        W1.id
      , W1.old_status_id
      , W1.new_status_id
      , W1.assignee
      , W1.author
      , W1.tracker_id
      , W1.role_id
      , CASE WHEN W2.id IS NOT NULL THEN 'bidir' ELSE 'unidir' END AS direction
     FROM
          workflows W1
          LEFT OUTER JOIN workflows W2 ON
                         W2.type          = W1.type
                     AND W2.new_status_id = W1.old_status_id
                     AND W2.old_status_id = W1.new_status_id
                     AND W2.tracker_id    = W1.tracker_id
                     AND W2.role_id       = W1.role_id
                     AND W2.assignee      = W1.assignee
                     AND W2.author        = W1.author
     WHERE
           W1.type='WorkflowTransition'
       AND CASE WHEN W2.id IS NOT NULL THEN W1.new_status_id > W1.old_status_id ELSE W1.id = W1.id END
       AND W1.tracker_id IN (?)
       AND W1.role_id IN (?)
  EOSQL

  def graph_edges(tracker_id, role_id)
    WorkflowTransition.find_by_sql [SQL, [tracker_id], [role_id]]
  end
end
