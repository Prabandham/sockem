class Page < ApplicationRecord
  belongs_to :site
  belongs_to :layout, optional: true
  before_save :determine_path, if: Proc.new { |page| page.path.blank? }
  validates :name, presence: true
  validates :name, uniqueness: { scope: :site_id }

  private

  def determine_path
    case name
    when "index.html"
      self.path = "/"
    when "home.html"
      self.path = "/"
    else
      self.path = "/" + name.split(".").first
    end
  end
end
