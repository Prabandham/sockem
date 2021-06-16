class Page < ApplicationRecord
  has_paper_trail
  belongs_to :site
  belongs_to :layout, optional: true
  before_save :determine_path, if: Proc.new { |page| page.path.blank? }
  validates :name, presence: true
  validates :name, uniqueness: { scope: :site_id }
  extend HTMLDiff

  def diff
    previous_version = paper_trail.previous_version
    binding.pry
  end

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
