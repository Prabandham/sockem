class Asset < ApplicationRecord
  belongs_to :site

  before_save :set_name

  private

  def set_name
    binding.pry
  end
end
