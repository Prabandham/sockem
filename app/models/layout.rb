class Layout < ApplicationRecord
  belongs_to :site
  has_many :pages
end
