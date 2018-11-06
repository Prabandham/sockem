module Cms
  class LayoutsController < ApplicationController
    before_action :authenticate_admin!

    before_action :set_layout, only: [:show, :edit, :update, :destroy]

    # GET /layouts
    # GET /layouts.json
    def index
      @layouts = Layout.all
    end

    # GET /layouts/1
    # GET /layouts/1.json
    def show
      respond_to do |format|
        format.json { render json: @layout }
      end
    end

    # GET /layouts/new
    def new
      @layout = Layout.new
    end

    # GET /layouts/1/edit
    def edit
    end

    # POST /layouts
    # POST /layouts.json
    def create
      @layout = Layout.find_or_initialize_by(
          name: layout_params[:name],
          site_id: layout_params[:site_id]
      )

      respond_to do |format|
        if @layout.update_attributes(layout_params)
          format.json { render json: @layout, status: :created }
        else
          format.json { render json: @layout.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /layouts/1
    # PATCH/PUT /layouts/1.json
    def update
      respond_to do |format|
        if @layout.update(layout_params)
          format.json { render json: @layout, status: :ok }
        else
          format.json { render json: @layout.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /layouts/1
    # DELETE /layouts/1.json
    def destroy
      @layout.destroy
      respond_to do |format|
        format.html { redirect_to layouts_url, notice: 'Layout was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_layout
      @layout = Layout.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def layout_params
      params.require(:layout).permit(:name, :content, :site_id)
    end
  end
end
