# frozen_string_literal: true

module WorkflowDiagramsHelper
  def menu_item(e)
    tag.li do
      tag.input(:value => e.id, :type => :checkbox) + tag.label(e.name)
    end
  end

  def trackers
    Tracker.sorted
  end

  def roles
    Role.sorted.select(&:consider_workflow?)
  end

  def filter_options
    { l(:label_tracker) => :tracker, l(:label_role)=> :role}
  end
end
