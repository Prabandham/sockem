class Page < ApplicationRecord
  belongs_to :site
  before_save :determine_path, if: Proc.new { |page| page.path.blank? }
  validates :name, presence: true
  validates :name, uniqueness: { scope: :site_id }

  private

  def determine_path
    case name
    when "index"
      self.path = "/"
    when "home"
      self.path = "/"
    else
      self.path = name.split(".").first
    end
  end
end
