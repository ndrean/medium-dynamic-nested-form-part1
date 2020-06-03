Rails.application.routes.draw do
  resources :authors#, only: [:index, :new, :create]
  #  get 'authors/index'
  #  get 'authors/new'
  #  post 'authors/create'
#   # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
