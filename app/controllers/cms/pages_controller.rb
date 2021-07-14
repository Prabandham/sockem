module Cms
  class PagesController < ApplicationController
    before_action :authenticate_admin!

    before_action :set_page, only: [:show, :edit, :update, :destroy]

    # GET /pages
    # GET /pages.json
    def index
      @pages = Page.all
    end

    # GET /pages/1
    # GET /pages/1.json
    def show
      respond_to do |format|
        format.js { render :show, status: 200 }
        format.json { render json: { name: @page.name, content: @page.content, id: @page.id } }
      end
    end

    # GET /pages/new
    def new
      @page = Page.new
    end

    # GET /pages/1/edit
    def edit
    end

    # POST /pages
    # POST /pages.json
    def create
      @page = Page.find_or_initialize_by(
          name: page_params[:name].strip.gsub('<br>', ''),
          site_id: page_params[:site_id]
      )

      respond_to do |format|
        if @page.update_attributes(page_params)
          format.json { render json: @page, status: :created }
        else
          format.json { render json: @page.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /pages/1
    # PATCH/PUT /pages/1.json
    # NOTE to associate a page to a layout use a template tag as discussed with Abhi
    # {{ layout "LAYOUT_TO_USE" }}
    # on the top of every page.
    # This will be stripped out and saved every time a layout has to be changed
    # they have to add the above layout tag. And it will read it and update
    def update
      respond_to do |format|
        if @page.update(page_params)
          format.html { render json: @page, status: :ok }
          format.json { render json: @page, status: :ok }
        else
          format.html { render json: @page.errors, status: :unprocessable_entity }
          format.json { render json: @page.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /pages/1
    # DELETE /pages/1.json
    def destroy
      @page.destroy
      respond_to do |format|
        format.html { redirect_to pages_url, notice: 'Page was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_page
      @page = Page.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def page_params
      params.require(:page).permit(:name, :path, :content, :site_id, :layout_id, :meta)
    end

    def update_layout
      return if page_params[:content].blank?

      layout_string = page_params[:content].match(/<!--(.*?)-->/).to_a.first
      layout_name = layout_string.gsub("<!--", "").gsub("-->", "").squish.split("=").last + ".html" if layout_string
      layout = Layout.find_by(name: layout_name, site_id: @page.site_id)
      @page.layout_id = layout.id if layout
      @page.save
    end
  end
end
