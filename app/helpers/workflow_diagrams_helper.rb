# frozen_string_literal: true

module WorkflowDiagramsHelper
  COLORS = [
    '#cb4b16', #orange
    '#d33682', #magenta
    '#6c71c4', #violet
    '#268bd2', #blue
    '#2aa198', #cyan
    '#859900', #green
    '#b58900', #yellow
    '#dc322f'  #red
  ]

  def marker_color(idx)
    COLORS[idx]
  end

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
