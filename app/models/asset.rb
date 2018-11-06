class Asset < ApplicationRecord
  belongs_to :site
  mount_uploader :attachment, ::AssetUploader
  validates :name, uniqueness: { scope: :site_id }

  before_validation :set_name

  def kind
    content_type = attachment.content_type
    if content_type.include?("application/ecmascript") || name.include?(".js")
      "js"
    elsif content_type.include?("css") || name.include?(".css")
      "css"
    elsif content_type.include?("image")
      "image"
    else
      "others"
    end
  end

  def process
    if kind == 'css'
      "<link rel='stylesheet' type='text/css' href='#{attachment.url}'>"
    elsif kind == 'js'
      "<script type='text/javascript' src='#{attachment.url}'></script>"
    end
  end

  private

  def set_name
    self.name = attachment.filename
  end
end
