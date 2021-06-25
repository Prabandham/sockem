module Cms
  class AssetsController < ApplicationController
    before_action :authenticate_admin!

    before_action :set_asset, only: [:show, :edit, :update, :destroy]

    # GET /assets
    # GET /assets.json
    def index
      @assets = Asset.all
    end

    # GET /assets/1
    # GET /assets/1.json
    def show
      respond_to do |format|
        format.html { redirect_to site_edit_cms_path(@asset.site) }
        format.js { render :show, status: 200 }
        format.json { render json: { name: @asset.name, content: @asset.attachment.file&.read || '', id: @asset.id } }
      end
    end

    # GET /assets/new
    def new
      @asset = Asset.new
    end

    # GET /assets/1/edit
    def edit; end

    # POST /assets
    # POST /assets.json
    def create
      @asset = Asset.new(asset_params)

      respond_to do |format|
        if @asset.save
          format.html { redirect_to @asset, notice: 'Asset was successfully created.' }
          format.json { render :show, status: :created, location: @asset }
        else
          format.html { render :new }
          format.json { render json: @asset.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /assets/1
    # PATCH/PUT /assets/1.json
    def update
      if content_asset_params[:content].present?
        file_name_array = content_asset_params[:name].split('.')
        file = Tempfile.new([file_name_array.first, ".#{file_name_array.last}"])
        file.write(content_asset_params[:content])
        file.rewind
        file.read
        @asset.attachment = File.open(file.path)
        @asset.save
        file.close
        file.unlink
      end
      @asset.update(asset_params)
      render json: { name: @asset.name, content: @asset.attachment.file&.read || '', id: @asset.id }
    end

    # DELETE /assets/1
    # DELETE /assets/1.json
    def destroy
      @asset.destroy
      respond_to do |format|
        format.html { redirect_to request.referer, notice: 'Asset was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    def custom_asset
      @asset = Asset.find_or_initialize_by(
        {
          name: custom_asset_params[:name].strip.gsub('<br>', ''),
          site_id: custom_asset_params[:site_id]
        }
      )
      respond_to do |format|
        if @asset.update_attributes(custom_asset_params)
          format.json { render json: @asset, status: :created }
        else
          format.json { render json: @asset.errors, status: :unprocessable_entity }
        end
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_asset
      @asset = Asset.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def asset_params
      params.require(:asset).permit(:priority)
    end

    def custom_asset_params
      params.require(:asset).permit(:name, :site_id)
    end

    def content_asset_params
      params.require(:asset).permit(:content, :name)
    end
  end
end
