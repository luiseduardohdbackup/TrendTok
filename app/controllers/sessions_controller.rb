class SessionsController < ApplicationController
  def new
    session[:request_token] = nil
    redirect_to oauth_request_token.authorize_url
  end
  
  def create
    request_token = session[:request_token]
    begin
      access_token = twitter_client.authorize(request_token.token,
                                              request_token.secret,
                                              :oauth_verifier => params[:oauth_verifier])

      if twitter_client.authorized?
        info = twitter_client.info
        user = User.find_or_create_by_twitter_id(info['id'], {
          :screen_name => info['screen_name'],
          :access_token => access_token.token,
          :access_secret => access_token.secret,
          :profile_image_url => info['profile_image_url']
        })
        session[:current_user] = user.id
      end
    rescue Net::HTTPFatalError, OAuth::Unauthorized
      flash[:alert] = "Sorry but Twitter is not responding at the moment."
    end
    redirect_to('/oauth.html')
  end

  def destroy
    session[:current_user] = nil
    redirect_to params[:return_to] || root_path
  end

end
