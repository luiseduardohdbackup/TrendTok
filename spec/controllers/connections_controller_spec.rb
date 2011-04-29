require 'spec_helper'

describe ConnectionsController do
  
  describe 'POST create' do

    def do_request(params = {})
      xhr :post, :create, params.merge(:format => :json)
    end

    before(:each) do
      Trend.stub!(:find).and_return(@trend = Factory(:trend))
      @trend.stub!(:add_connection_for)
    end

    it "finds the trend" do
      Trend.should_receive(:find).and_return(@trend)
      do_request :trend_id => @trend.id
    end

    it "adds a connection to the trend" do
      @trend.should_receive(:add_connection_for)
      do_request :trend_id => @trend.id
    end

  end

  describe 'POST ping' do
    
    def do_request(params = {})
      xhr :post, :ping, params.merge(:format => :js)
    end

    before(:each) do
      Trend.stub!(:find).and_return(@trend = Factory(:trend))
      @trend.stub!(:find_connection_for).and_return(@connection = Factory(:connection))
    end

    it "finds the trend" do
      Trend.should_receive(:find).and_return(@trend)
      do_request :trend_id => 1, :connection_id => 2
    end

    it "finds the connection" do
      @trend.should_receive(:find_connection_for).and_return(@connection)
      do_request :trend_id => 1, :connection_id => 2
    end

    it "pings the connection" do
      @connection.should_receive(:ping!)
      do_request :trend_id => 1, :connection_id => 2
    end

  end

end
