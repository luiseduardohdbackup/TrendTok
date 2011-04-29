require 'spec_helper'

describe User do
  before(:each) do
    Factory(:user)
  end

  it { should validate_presence_of(:screen_name) }
  it { should validate_presence_of(:twitter_id) }
  it { should validate_presence_of(:access_token) }
  it { should validate_presence_of(:access_secret) }
  it { should validate_presence_of(:profile_image_url) }
end
