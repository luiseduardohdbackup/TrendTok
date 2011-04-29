require 'spec_helper'

describe Trend do
  before(:each) do
    Factory(:trend)
  end

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:as_of) }
  it { should validate_uniqueness_of(:name) }
  it { should_not allow_mass_assignment_of(:tokbox_session) }
  it { should have_many(:connections) }

  it "should get tokbox session from TokBox API" do
    @trend = Factory(:trend, :tokbox_session => nil)
    @trend.tokbox_session.should_not be_nil
  end

  it "should populate trends from twitter" do
    Trend.populate.should_not be_empty
  end

  it "should generate slug from name" do
    @trend = Factory(:trend, :name => "#HashTagWithSpecialCharsñéço ゲコゴサザシジ")
    @trend.friendly_id.should == "hashtagwithspecialcharsneco-ゲコゴサザシジ"
  end

  it "creates a connection for the trend" do
    @trend = Factory(:trend)
    @trend.add_connection_for("testingconnection1234")
    @trend.reload
    @trend.connections.map(&:tokbox_connection_id).should include("testingconnection1234")
  end
end
