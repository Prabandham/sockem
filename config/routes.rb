Rails.application.routes.draw do

  root 'home#index'
  scope :cms, module: "cms", path: "cms" do
    resources :assets
    resources :layouts
    resources :pages
    resources :sites do
      get :edit_cms
      post :add_assets
    end
  end
  match "*path", to: "home#index", via: :all
end
