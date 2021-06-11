module Cms
  class SitesController < ApplicationController
    before_action :authenticate_admin!

    before_action :set_site, only: [:show, :edit, :edit_cms, :update, :destroy, :add_assets]

    # GET /sites
    # GET /sites.json
    def index
      @sites = Site.all
    end

    # GET /sites/1
    # GET /sites/1.json
    def show
    end

    # GET /sites/new
    def new
      @site = Site.new
    end

    # GET /sites/1/edit
    def edit
    end

    def edit_cms
      @data = {
          site_name: @site.name,
          pages: @site.pages,
          assets: @site.assets.sort { |a,b| a.priority.to_i <=> b.priority.to_i }.reverse,
          layouts: @site.layouts
      }
    end

    # POST /sites
    # POST /sites.json
    def create
      @site = Site.new(site_params)

      respond_to do |format|
        if @site.save
          @site.link_assets_from(site_params[:initialize_with]) if site_params[:initialize_with].present?
          # Make the following redirect to editor path
          format.html { redirect_to site_edit_cms_path(@site), notice: 'Site was successfully created.' }
          format.json { render :show, status: :created, location: @site }
        else
          format.html { render :new }
          format.json { render json: @site.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /sites/1
    # PATCH/PUT /sites/1.json
    def update
      respond_to do |format|
        if @site.update(site_params)
          format.html { redirect_to @site, notice: 'Site was successfully updated.' }
          format.json { render :show, status: :ok, location: @site }
        else
          format.html { render :edit }
          format.json { render json: @site.errors, status: :unprocessable_entity }
        end
      end
    end

    def add_assets
      @asset = @site.assets.new(asset_params)
      @asset.save
    end

    # DELETE /sites/1
    # DELETE /sites/1.json
    def destroy
      @site.assets.delete_all
      @site.pages.delete_all
      @site.layouts.delete_all
      @site.destroy
      respond_to do |format|
        format.html { redirect_to sites_url, notice: 'Site was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_site
      @site = Site.find(params[:id] || params[:site_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def site_params
      params.require(:site).permit(
        :name,
        :domain,
        :description,
        :google_analytics_key,
        :meta, 
        :initialize_with,
        assets: [:attachment]
      )
    end

    def asset_params
      params.require(:assets).permit!
    end
  end
end
