Rails.application.routes.draw do

  scope :cms, module: "cms", path: "cms" do
    resources :assets
    resources :layouts
    resources :pages
    resources :sites
  end
end
