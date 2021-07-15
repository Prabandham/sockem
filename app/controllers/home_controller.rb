class HomeController < ApplicationController
  before_action :set_site
  before_action :set_page
  layout false

  def index
    render :no_site and return unless @site && @page && @page.layout

    template = Liquid::Template.parse(@page.layout.content)
    hash = construct_template_values
    @parsed_template = template.render(hash.stringify_keys)
  end

  private

  def set_site
    @site ||= Site.find_by(domain: request.base_url)
  end

  def set_page
    @page ||= Page.find_by(path: request.path, site_id: @site.id) if @site
  end

  def construct_template_values
    {
      page: @page.content,
      include_stylesheets: style_sheets,
      include_javascripts: javascripts,
      include_page_meta: @page.meta,
      current_site: "<div id='current-site-id' class='d-none'>#{@site.id}</div>",
      include_site_edit_link: edit_link
    }.stringify_keys
  end

  def javascripts
    @site.assets.select do |a|
      a.kind == "js"
    end.sort { |a,b| a.priority.to_i <=> b.priority.to_i }.reverse.map(&:process)
  end

  def style_sheets
    @site.assets.select do |a|
      a.kind == "css"
    end.sort { |a,b| a.priority.to_i <=> b.priority.to_i }.reverse.map(&:process)
  end

  def edit_link
    if current_admin
      @edit_link ||= "<a class='nav-link' href='/cms/sites/#{@site.id}/edit_cms' target='_blank'>Edit Site</a>"
    end
  end
end
