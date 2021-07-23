# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resource :workflow_diagram, only: %i[show update]
end
