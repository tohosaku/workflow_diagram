# frozen_string_literal: true

class WorkflowDiagramsController < ApplicationController
  # layout 'admin'
  # before_action :require_admin
  helper :workflows

  def show
    respond_to do |format|
      format.html
      format.json do
        keyname = params[:keyname]
        key      = params[:key]
        values   = params[:values]
        render json: WorkflowDiagram.graph(keyname, key, values)
      end
    end
  end
end
