class WorkflowDiagramsController < ApplicationController
  # layout 'admin'
  # before_action :require_admin

  def show
    respond_to do |format|
      format.html
      format.json { render json: graph }
    end
  end

  private

  def graph
    {
      children: graph_children.map { |c| { id: "n#{c.id}", labels: [{ text: c.name }] } },
      edges: graph_edges.map do |e|
        { id: "e#{e.id}", sources: ["n#{e.old_status_id}"], targets: ["n#{e.new_status_id}"] }
      end.uniq
    }
  end

  def graph_children
    IssueStatus.all
  end

  def graph_edges
    WorkflowTransition.all
  end
end
