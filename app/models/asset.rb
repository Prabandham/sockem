class Asset < ApplicationRecord
  belongs_to :site
  mount_uploader :attachment, ::AssetUploader
  validates :name, uniqueness: { scope: :site_id }

  before_validation :set_name

  private

  def set_name
    self.name = attachment.filename
  end
end
