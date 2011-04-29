TokboxDemo::Application.routes.draw do
  get 'oauth_callback' => 'sessions#create'
  get 'login' => 'sessions#new'
  get 'logout' => 'sessions#destroy'
  resources :trends, :only => :show do
    member do
      post :tokbox_session
    end

    resources :connections, :only => :create do
      post :ping
    end
  end
  root :to => 'trends#show'
end
