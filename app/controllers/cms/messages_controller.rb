module Cms
  class MessagesController < ApplicationController
    def index
      # TODO: Enable pagination and filter
      @messages = Message.where(site_id: params[:site_id])
      render json: @messages
    end

    def create
      @message = Message.new(message_params)
      if @message.save
        render json: :ok, status: :created
      else
        render json: { errors: message.errors }, status: :unprocessable_entity
      end
    end

    private

    def message_params
      params.require(:message).permit(:first_name, :last_name, :site_id, :blob, :email, :content)
    end
  end
end
