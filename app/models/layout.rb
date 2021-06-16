class Layout < ApplicationRecord
  has_paper_trail
  belongs_to :site
  has_many :pages
end
