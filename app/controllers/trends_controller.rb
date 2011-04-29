class TrendsController < ApplicationController
  before_filter :find_trend, :only => [:allow_connection, :tokbox_session]

  def show
    @trend = if params[:id]
      Trend.find(params[:id])
    else
      Trend.first
    end
    store_location
    @token = @trend.tokbox_token
    @latest = Trend.latest
    session[:request_token] = nil
  end

  def tokbox_session
    render :json => {:session_id => @trend.tokbox_session}
  end

  private

  def find_trend
    @trend = Trend.find(params[:id])
  end

end
