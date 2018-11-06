class HomeController < ApplicationController
  before_action :set_site
  before_action :set_page
  layout false

  def index
    # binding.pry
    # if request.path.include?("/uploads/asset/attachment")
    # end
    render :no_site and return unless @site && @page && @page.layout
    template = Liquid::Template.parse(@page.layout.content)
    style_sheets = @site.assets.select { |a| a.kind == "css" }.map(&:process)
    javascripts = @site.assets.select { |a| a.kind == "js" }.map(&:process)
    @parsed_template = template.render(
        {
            'page' => @page.content,
            'include_stylesheets' => style_sheets,
            'include_javascripts' => javascripts
        }
    )
  end

  private

  def set_site
    @site = Site.find_by(domain: request.domain)
  end

  def set_page
    @page = Page.find_by(path: request.path, site_id: @site.id)
  end
end
