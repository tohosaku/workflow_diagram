# frozen_string_literal: true

module WorkflowDiagramsHelper
  def trackers
    Tracker.sorted
  end

  def roles
    Role.sorted.select(&:consider_workflow?)
  end

  def filter_options
    { l(:label_tracker) => :tracker, l(:label_role) => :role }
  end
end
