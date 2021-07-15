class Page < ApplicationRecord
  has_paper_trail
  belongs_to :site, touch: true
  belongs_to :layout, optional: true, touch: true
  before_create :determine_path, if: Proc.new { |page| page.path.blank? }
  validates :name, presence: true
  validates :name, uniqueness: { scope: :site_id }

  def diff
    previous_version = paper_trail.previous_version
    binding.pry
  end

  private

  def determine_path
    self.path = case name
                when 'index.html'
                  '/'
                when 'home.html'
                  '/'
                else
                  "/ + #{name.split('.').first}"
                end
  end
end
