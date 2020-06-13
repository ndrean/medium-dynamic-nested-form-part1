Rails.application.routes.draw do
  resources :authors, only: [:index, :new, :create]
  get 'authors/edit'
  patch 'authors/update'
  #  get 'authors/new'
  #  post 'authors/create'
#   # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
