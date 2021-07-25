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
    {
      children: graph_children.map { |c| { id: "n#{c.id}", labels: [{ text: c.name }] } },
      edges: graph_edges(tracker_id, role_id).map do |e|
        { id: "e#{e.id}", sources: ["n#{e.old_status_id}"], targets: ["n#{e.new_status_id}"] }
      end.uniq
    }
  end

  def graph_children
    IssueStatus.all
  end

  def graph_edges(tracker_id, role_id)
    WorkflowTransition.where(tracker_id: tracker_id, role_id: role_id)
  end
end
