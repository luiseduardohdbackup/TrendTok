class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :logged_in?

  def logged_in?
    !current_user.nil?
  end

  def current_user
    @current_user ||= User.find_by_id(session[:current_user]) if session[:current_user]
  end

  protected

  def store_location
    session[:return_to] = request.fullpath
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
  end

  def twitter_client
    @twitter_client ||= TwitterOAuth::Client.new({
      :consumer_key => APP_CONFIG['twitter']['key'],
      :consumer_secret => APP_CONFIG['twitter']['secret']
    })
  end

  def oauth_request_token
    return session[:request_token] if session[:request_token]
    session[:request_token] = twitter_client.authentication_request_token(:oauth_callback => oauth_callback_url)
  end

end
