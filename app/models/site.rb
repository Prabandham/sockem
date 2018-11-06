class Site < ApplicationRecord
  has_many :layouts
  has_many :pages
  has_many :assets
end
