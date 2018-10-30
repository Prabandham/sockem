class HomeController < ApplicationController
  before_action :set_site
  before_action :set_page
  layout false

  def index
    render :no_site and return unless @site
    template = Liquid::Template.parse(@page.layout.content)
    @parsed_template = template.render({"page" => @page.content})
    puts @parsed_template
  end

  private

  def set_site
    @site = Site.find_by(domain: request.domain)
  end

  def set_page
    @page = Page.find_by(path: request.path)
  end
end
