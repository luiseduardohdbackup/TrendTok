require 'spec_helper'

describe SessionsController do

  it "should redirect to twitter's authorize url" do
    get :new
    response.should redirect_to(controller.send(:oauth_request_token).authorize_url)
  end

  it "should authorize and create a user if it not exists" do
    pending "Fake autorhize from twitter?"
  end

  it "should log out a user" do
    get :destroy
    controller.logged_in?.should be_false
  end
end
