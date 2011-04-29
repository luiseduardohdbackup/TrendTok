class ConnectionsController < ApplicationController
  before_filter :find_trend
  respond_to :json, :only => [:create]

  def create
    @connection = @trend.add_connection_for(params[:tokbox_connection_id])
    respond_with(@connection, :status => :created, :location => @trend)
  end

  def ping
    @connection = @trend.find_connection_for(params[:connection_id])
    @connection.ping! if @connection
  end

  private

  def find_trend
    @trend = Trend.find(params[:trend_id])
  end
end
