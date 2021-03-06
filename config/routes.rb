Rails.application.routes.draw do

  devise_for :admins
  root 'home#index'
  scope :cms, module: 'cms', path: 'cms' do
    resources :assets
    resources :layouts
    resources :pages
    resources :sites do
      get :edit_cms
      post :add_assets
      resources :messages
    end
    post 'custom-assets', to: 'assets#custom_asset'
  end
  match '*path', to: 'home#index', via: :all
end
