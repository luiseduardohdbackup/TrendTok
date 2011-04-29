class User < ActiveRecord::Base
  validates_presence_of :screen_name, :twitter_id, :access_token, :access_secret,
    :profile_image_url
end
